import React, { createContext, useContext, useState, useEffect } from "react";
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
      return swal("CANNOT FETCH ACCOUNT: network error");
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

  return (
    <PactContext.Provider
      value={{
        transferLoading,
        setTransferLoading,
        getPubFromPriv,
        getBalance,
        transfer,
        getAcctDetails,
      }}
    >
      {props.children}
    </PactContext.Provider>
  );
};
