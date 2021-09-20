import React, { createContext, useContext, useState } from "react";
import Pact from "pact-lang-api";
import { NetworkContext } from "./NetworkContext";
import { AuthContext } from "./AuthContext";
import swal from "sweetalert";
import { formatAmount } from "../util/format-helpers";

export const PactContext = createContext(null);

export const PactProvider = (props) => {
  const networkContext = useContext(NetworkContext);
  const authContext = useContext(AuthContext);
  const [transferLoading, setTransferLoading] = useState(false);
  const [txList, setTxList] = useState({});
  const [account, setAccount] = useState({
    account: null,
    guard: null,
    balance: 0,
  });

  const TTL = 28800;
  const GAS_PRICE = 0.0000000001;
  const GAS_LIMIT = 10000;
  const creationTime = () => Math.round(new Date().getTime() / 1000) - 15;
  const host = (chainId) =>
    `https://${networkContext.network.kadenaServer}/chainweb/0.0/${networkContext.network.networkID}/chain/${chainId}/pact`;

  const setReqKeysLocalStorage = (key) => {
    const reqKeysTx = JSON.parse(localStorage.getItem("reqKeys"));
    reqKeysTx.push(key);
    localStorage.setItem(`reqKeys`, JSON.stringify(reqKeysTx));
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
            TTL,
            creationTime()
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
      return swal("GET BALANCE FAILED: NETWORK ERROR");
    }
  };

  const sleepPromise = async (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const wait = async (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const getTransferList = async (chainId) => {
    setTxList({});
    // var time = 240;
    // var pollRes = [];
    // while (time > 0) {
    // await wait(5000);
    var reqKeyList = JSON.parse(localStorage.getItem("reqKeys"));
    let tx = await Pact.fetch.poll(
      { requestKeys: Object.values(reqKeyList) },
      host(`${chainId}`)
    );
    if (Object.keys(tx).length !== 0) {
      setTxList(tx);
    } else {
      setTxList("NO_TX_FOUND");
    }
    // Object.values(reqKeyList).map(async (reqKey) => {

    // });
  };

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
      setTransferLoading(false);

      return swal(
        "POLL FAILED:",
        " Please try again. Note that the transaction specified may not exist on target chain"
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

  const transfer = async (
    tokenAddress,
    fromAcct,
    fromAcctPrivKey,
    toAcct,
    amount,
    chainId,
    guard
  ) => {
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
      const pollRes = await pollTxRes(reqKey, host(chainId));
      if (pollRes.result.status === "success") {
        setTransferLoading(false);
        setReqKeysLocalStorage(reqKey);
        return swal(
          `TRANSFER SUCCESS:`,
          ` from ${fromAcct} to ${toAcct} for ${amount} ${tokenAddress} on chain ${chainId}`
        );
      } else {
        setTransferLoading(false);

        return swal("CANNOT PROCESS TRANSFER: invalid blockchain tx");
      }
    } catch (e) {
      setTransferLoading(false);

      console.log(e);
      return swal("CANNOT PROCESS TRANSFER: network error");
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

          return swal(
            `CROSS-CHAIN TRANSFER SUCCESS:`,
            `${amount} ${tokenAddress} transfered from chain ${fromChain} to ${toChain} for account ${account}`
          );
        } else {
          //funds were burned on fromChain but not minted on toChain
          //visit https://transfer.chainweb.com/xchain.html and approve the mint with the reqKey
          setTransferLoading(false);

          return swal(
            `PARTIAL CROSS-CHAIN TRANSFER:`,
            `Funds burned on chain ${fromChain} with reqKey ${reqKey} please mint on chain ${toChain}`
          );
        }
      } else {
        //burn did not work
        setTransferLoading(false);

        return swal(
          `CANNOT PROCESS CROSS-CHAIN TRANSFER:`,
          `Cannot send from origin chain ${fromChain}`
        );
      }
    } catch (e) {
      setTransferLoading(false);

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
      const accountPubKey = getPubFromPriv(accountPrivKey);
      let chainBalances = {};
      for (let i = 0; i < 20; i++) {
        if (i.toString() === chainId) continue;
        let details = await getAcctDetails(tokenAddress, account, i.toString());
        chainBalances[i.toString()] = details.balance;
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
      setTransferLoading(false);

      console.log(e);
      return swal("CANNOT PROCESS BALANCE FUNDS:", "Network error");
    }
  };

  return (
    <PactContext.Provider
      value={{
        txList,
        transferLoading,
        setTransferLoading,
        getPubFromPriv,
        getBalance,
        balanceFunds,
        transfer,
        getAcctDetails,
        getTransferList,
      }}
    >
      {props.children}
    </PactContext.Provider>
  );
};
