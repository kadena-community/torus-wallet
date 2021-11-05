import React, { createContext, useContext, useState, useEffect } from 'react';
import Pact from 'pact-lang-api';
import { NetworkContext } from './NetworkContext';
import { AuthContext } from './AuthContext';

export const PactContext = createContext(null);

export const PactProvider = (props) => {
  const networkContext = useContext(NetworkContext);
  const authContext = useContext(AuthContext);
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
            '',
            chainId,
            GAS_PRICE,
            GAS_LIMIT,
            TTL,
            creationTime()
          ),
        },
        host(chainId)
      );
      if (data.result.status === 'success') {
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
      return 'CANNOT FETCH ACCOUNT: network error';
    }
  };

  const getPubFromPriv = (pubKey) => {
    return Pact.crypto.restoreKeyPairFromSecretKey(pubKey)?.publicKey;
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
      return 'GET BALANCE FAILED: NETWORK ERROR';
    }
  };

  return (
    <PactContext.Provider value={{ getBalance, getPubFromPriv }}>
      {props.children}
    </PactContext.Provider>
  );
};
