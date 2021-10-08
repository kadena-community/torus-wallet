import React, { createContext, useContext, useState } from "react";
import Pact from "pact-lang-api";
import { NetworkContext } from "./NetworkContext";
import swal from "sweetalert";
import { formatAmount } from "../util/format-helpers";
import SuccessTransactionModal from "../components/modals/SuccessTransactionModal";
import { ModalContext } from "./ModalContext";
import { NotificationContext, STATUSES } from "./NotificationContext";
import { toast } from "react-toastify";

export const PactContext = createContext(null);

export const PactProvider = (props) => {
  const networkContext = useContext(NetworkContext);
  const modalContext = useContext(ModalContext);
  const notificationContext = useContext(NotificationContext);

  const [confirmResponseTransfer, setConfirmResponseTransfer] = useState(false);

  const [txList, setTxList] = useState({});
  // const [account, setAccount] = useState({
  //   account: null,
  //   guard: null,
  //   balance: 0,
  // });

  const TTL = 28800;
  const GAS_PRICE = 0.0000000001;
  const GAS_LIMIT = 10000;
  const creationTime = () => Math.round(new Date().getTime() / 1000) - 15;
  const host = (chainId) =>
    `https://${networkContext.network.kadenaServer}/chainweb/0.0/${networkContext.network.networkID}/chain/${chainId}/pact`;
  
  //TO FIX, not working when multiple toasts are there
  const toastId = React.useRef(null);
  // const [toastIds, setToastIds] = useState({})

  const setReqKeysLocalStorage = (key) => {
    const swapReqKeysLS = JSON.parse(localStorage.getItem("reqKeys"));
    if (!swapReqKeysLS) {
      //first saving swapReqKeys in localstorage
      localStorage.setItem(`reqKeys`, JSON.stringify([key]));
    } else {
      swapReqKeysLS.push(key);
      localStorage.setItem(`reqKeys`, JSON.stringify(swapReqKeysLS));
    }
  };
  const getAcctDetails = async (tokenAddress, acct, chainId) => {
    try {
      //this function only READS from the blockchain
      let data = await Pact.fetch.local(
        {
          pactCode: `(${tokenAddress}.details ${JSON.stringify(acct)})`,
          keyPairs: Pact.crypto.genKeyPair(),
          meta: Pact.lang.mkMeta(
            "",
            chainId,
            GAS_PRICE,
            GAS_LIMIT,
            creationTime(),
            TTL
          ),
        },
        host(chainId)
      );

      if (data.result.status === "success") {
        //account exists
        //return {account: string, guard:obj, balance: decimal}
        return data.result.data;
      } else {
        //account does not exist
        return { account: null, guard: null, balance: 0 };
      }
    } catch (e) {
      //most likely a formatting or rate limiting error

      console.log(e);
      return "CANNOT FETCH ACCOUNT: network error";
    }
  };

  const getBalance = async (tokenAddress, userAddress) => {
    try {
      //get balance for all 20 chains
      const balances = [];
      for (let i = 0; i < 20; i++) {
        const chainId = i.toString();
        const acctDetails = await getAcctDetails(
          tokenAddress,
          userAddress,
          chainId
        );
        if (acctDetails.account) {
          balances[chainId] = acctDetails.balance;
        } else {
          balances[chainId] = 0;
        }
      }
      return balances;
    } catch (e) {
      console.log(e);
      return swal("GET BALANCE FAILED: NETWORK ERROR", {
        icon: "error",
      });
    }
  };

  const closeModal = () => {
    modalContext.closeModal();
  };

  const sleepPromise = async (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  // const wait = async (timeout) => {
  //   return new Promise((resolve) => {
  //     setTimeout(resolve, timeout);
  //   });
  // };

  const pollTxRes = async (reqKey, host) => {
    //check kadena tx status until we get a response (success or fail
    //  or 480 seconds has gone by
    var timeLimit = 480;
    var sleepTime = 5;
    var pollRes;
    while (timeLimit > 0) {
      if (timeLimit !== 480) await sleepPromise(sleepTime * 1000);

      pollRes = await Pact.fetch.poll({ requestKeys: [reqKey] }, host);
      if (Object.keys(pollRes).length === 0) {
        timeLimit = timeLimit - sleepTime;
      } else {
        timeLimit = 0;
      }

      // exponential backoff to reduce server load
      if (sleepTime < 30) {
        sleepTime = sleepTime * 2;
      }
    }
    if (pollRes[reqKey]) {
      return pollRes[reqKey];
    } else {
      return swal(
        "POLL FAILED:",
        " Please try again. Note that the transaction specified may not exist on target chain",
        {
          icon: "error",
        }
      );
    }
  };

  const getPubFromPriv = (pubKey) => {
    return Pact.crypto.restoreKeyPairFromSecretKey(pubKey).publicKey;
  };

  const makePactContCommand = (
    chainId,
    pactId,
    proof,
    step,
    meta,
    networkId,
    rollback = false
  ) => ({
    type: "cont",
    keyPairs: [],
    meta,
    step,
    rollback,
    pactId,
    proof,
    networkId,
  });

  const viewSuccessModal = (
    fromAcct,
    toAcct,
    amount,
    senderChainId,
    receiverChainId,
    onClose
  ) => {
    return modalContext.openModal({
      content: (
        <SuccessTransactionModal
          fromAccount={fromAcct}
          toAccount={toAcct}
          amount={amount}
          senderChainId={senderChainId}
          receiverChainId={receiverChainId}
          onClose={onClose}
        />
      ),
    });
  };

  const pollingNotif = (reqKey) => {
    return (toastId.current = notificationContext.showNotification({
      title: "TRANSFER IN PROCESS:  The transfer will take a few minutes",
      message: reqKey,
      type: STATUSES.INFO,
      autoClose: 92000,
      hideProgressBar: false,
    }));
  };

  const transfer = async (
    tokenAddress,
    fromAcct,
    fromAcctPrivKey,
    toAcct,
    amount,
    chainId,
    guard
  ) => {
    setConfirmResponseTransfer(false);
    try {
      const fromAcctPubKey = getPubFromPriv(fromAcctPrivKey);
      const res = await Pact.fetch.send(
        {
          pactCode: `(${tokenAddress}.transfer-create ${JSON.stringify(
            fromAcct
          )} ${JSON.stringify(toAcct)} (read-keyset "recp-ks") ${formatAmount(
            amount
          )})`,
          networkId: networkContext.network.networkID,
          keyPairs: [
            {
              //EXCHANGE ACCOUNT KEYS
              //  PLEASE KEEP SAFE
              publicKey: fromAcctPubKey,
              secretKey: fromAcctPrivKey,
              clist: [
                //capability to transfer
                {
                  name: `${tokenAddress}.TRANSFER`,
                  args: [fromAcct, toAcct, +formatAmount(amount)],
                },
                //capability for gas
                {
                  name: `coin.GAS`,
                  args: [],
                },
              ],
            },
          ],
          meta: Pact.lang.mkMeta(
            fromAcct,
            chainId,
            GAS_PRICE,
            GAS_LIMIT,
            creationTime(),
            TTL
          ),
          envData: {
            "recp-ks": guard,
          },
        },
        host(chainId)
      );
      const reqKey = res.requestKeys[0];
      pollingNotif(reqKey);
      const pollRes = await pollTxRes(reqKey, host(chainId));
      if (pollRes.result.status === "success") {
        await toast.dismiss(toastId.current);
        setReqKeysLocalStorage(reqKey);
        setConfirmResponseTransfer(true);
        viewSuccessModal(
          fromAcct,
          toAcct,
          amount,
          chainId,
          chainId,
          closeModal
        );
      } else {
        await toast.dismiss(toastId.current);
        return swal("CANNOT PROCESS TRANSFER: invalid blockchain tx", {
          icon: "error",
        });
      }
    } catch (e) {
      await toast.dismiss(toastId.current);
      console.log(e);
      return swal("CANNOT PROCESS TRANSFER: network error", {
        icon: "error",
      });
    }
  };

  const transferCrossChainSameAccount = async (
    tokenAddress,
    account,
    accountPrivKey,
    amount,
    fromChain,
    toChain
  ) => {
    setConfirmResponseTransfer(false);
    swal(
      "TRANSFER SAME CHAIN IN PROCESS",
      `Trasfering ${amount} KDA by chain ${fromChain} to ${toChain}`,
      {
        icon: "info",
        timer: 5000,
      }
    );
    try {
      const accountPubKey = getPubFromPriv(accountPrivKey);
      const burn = await Pact.fetch.send(
        {
          pactCode: `(${tokenAddress}.transfer-crosschain ${JSON.stringify(
            account
          )} ${JSON.stringify(account)} (read-keyset "own-ks") ${JSON.stringify(
            toChain
          )} ${formatAmount(amount)})`,
          networkId: networkContext.network.networkID,
          keyPairs: [
            {
              //EXCHANGE ACCOUNT KEYS
              //  PLEASE KEEP SAFE
              publicKey: accountPubKey,
              secretKey: accountPrivKey,
              clist: [],
            },
          ],
          meta: Pact.lang.mkMeta(
            account,
            fromChain,
            GAS_PRICE,
            GAS_LIMIT,
            creationTime(),
            TTL
          ),
          envData: {
            "own-ks": { pred: "keys-all", keys: [accountPubKey] },
          },
        },
        host(fromChain)
      );
      const reqKey = burn.requestKeys[0];
      const pollRes = await pollTxRes(reqKey, host(fromChain));
      if (pollRes.result.status === "success") {
        const pactId = pollRes.continuation.pactId;
        const targetChainId =
          pollRes.continuation.yield.provenance.targetChainId;
        const spvCmd = { targetChainId: targetChainId, requestKey: pactId };
        let proof;
        while (!proof) {
          const spvRes = await Pact.fetch.spv(spvCmd, host(fromChain));
          if (
            spvRes !==
            "SPV target not reachable: target chain not reachable. Chainweb instance is too young"
          ) {
            proof = spvRes;
          }
          await sleepPromise(5000);
        }
        const meta = Pact.lang.mkMeta(
          "free-x-chain-gas",
          toChain,
          GAS_PRICE,
          300,
          creationTime(),
          TTL
        );
        // const contCmd = {type: "cont", keyPairs:[], pactId: pactId, rollback: false, step: 1, meta: m, proof: proof, networkId: NETWORK_ID};
        // const cmd = Pact.simple.cont.createCommand( contCmd.keyPairs, contCmd.nonce, contCmd.step, contCmd.pactId,
        //                                                     contCmd.rollback, contCmd.envData, contCmd.meta, contCmd.proof, contCmd.networkId);
        const continuationCommand = makePactContCommand(
          toChain,
          reqKey,
          proof,
          1,
          meta,
          networkContext.network.networkID
        );
        const mint = await Pact.fetch.send(continuationCommand, host(toChain));
        const mintReqKey = mint.requestKeys[0];
        const mintPollRes = await pollTxRes(mintReqKey, host(toChain));
        if (mintPollRes.result.status === "success") {
          setReqKeysLocalStorage(mintReqKey);
          setConfirmResponseTransfer(true);
          return swal(
            `CROSS-CHAIN TRANSFER SUCCESS:`,
            `${amount} ${tokenAddress} transfered from chain ${fromChain} to ${toChain} for account ${account}`,
            {
              icon: "success",
            }
          );
        } else {
          //funds were burned on fromChain but not minted on toChain
          //visit https://transfer.chainweb.com/xchain.html and approve the mint with the reqKey

          return swal(
            `PARTIAL CROSS-CHAIN TRANSFER:`,
            `Funds burned on chain ${fromChain} with reqKey ${reqKey} please mint on chain ${toChain}`,
            {
              icon: "warning",
            }
          );
        }
      } else {
        //burn did not work

        return swal(
          `CANNOT PROCESS CROSS-CHAIN TRANSFER:`,
          `Cannot send from origin chain ${fromChain}`,
          {
            icon: "error",
          }
        );
      }
    } catch (e) {
      console.log(e);
      return "CANNOT PROCESS CROSS-CHAIN TRANSFER: Network error";
    }
  };

  const balanceFunds = async (
    tokenAddress,
    account,
    accountPrivKey,
    amountRequested,
    amountAvailable,
    chainId
  ) => {
    try {
      // const accountPubKey = getPubFromPriv(accountPrivKey);
      let chainBalances = {};

      for (let i = 0; i < 20; i++) {
        if (i.toString() !== chainId) {
          await sleepPromise(1000);
          let details = await getAcctDetails(
            tokenAddress,
            account,
            i.toString()
          );
          chainBalances[i.toString()] = details.balance;
        }
      }
      var sorted = [];
      for (var cid in chainBalances) {
        sorted.push([cid, chainBalances[cid]]);
      }
      sorted.sort(function (a, b) {
        return b[1] - a[1];
      });
      var total = 0;
      var transfers = [];
      const amountNeeded = amountRequested - amountAvailable;
      for (let i = 0; i < sorted.length; i++) {
        var halfBal = sorted[i][1] / 2;
        transfers.push([sorted[i][0], halfBal]);
        total = total + halfBal;
        if (total > amountNeeded) break;
      }
      for (let i = 0; i < transfers.length; i++) {
        await transferCrossChainSameAccount(
          "coin",
          account,
          accountPrivKey,
          transfers[i][1],
          transfers[i][0],
          chainId
        );
      }

      return `BALANCE FUNDS SUCCESS`;
    } catch (e) {
      console.log(e);
      return swal("CANNOT PROCESS BALANCE FUNDS:", "Network error", {
        icon: "error",
      });
    }
  };

  return (
    <PactContext.Provider
      value={{
        host,
        txList,
        setTxList,
        getPubFromPriv,
        getBalance,
        balanceFunds,
        confirmResponseTransfer,
        setConfirmResponseTransfer,
        pollingNotif,
        transfer,
        getAcctDetails,
      }}
    >
      <>{props.children}</>
    </PactContext.Provider>
  );
};
