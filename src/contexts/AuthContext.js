/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useState, useEffect } from "react";
import Pact from "pact-lang-api";
import { TorusContext } from "./TorusContext";
import { PactContext } from "./PactContext";
import { NetworkContext } from "./NetworkContext";

const GOOGLE = "google";

const verifierMap = {
  [GOOGLE]: {
    name: "Google",
    typeOfLogin: "google",
    verifier: process.env.REACT_APP_TORUS_VERIFIER,
    clientId: process.env.REACT_APP_TORUS_GOOGLE_CLIENT_ID,
  },
};

export const AuthContext = createContext(null);

export const AuthProvider = (props) => {
  const pact = useContext(PactContext);
  const networkContext = useContext(NetworkContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connectingLoading, setConnectingLoading] = useState(false);

  const [totalBalance, setTotalBalance] = useState(0);
  const torus = useContext(TorusContext);

  useEffect(() => {
    async function getBalanceWrapper() {
      if (user?.publicKey) {
        setLoading(true);
        const balance = await pact.getBalance("coin", user.publicKey);
        setUser({ ...user, balance: balance });
        setLoading(false);
      }
    }
    getBalanceWrapper();
  }, [networkContext.network]);

  useEffect(() => {
    async function getBalanceWrapper() {
      if (user?.publicKey) {
        const balance = await pact.getBalance("coin", user.publicKey);
        setUser({ ...user, balance: balance });
      }
    }
    getBalanceWrapper();
  }, [pact.transferLoading]);

  const login = async () => {
    setLoading(true);
    try {
      const { typeOfLogin, clientId, verifier } = verifierMap[GOOGLE];
      const loginDetails = await torus.torusdirectsdk.triggerLogin({
        typeOfLogin,
        verifier,
        clientId,
      });

      const keyPair = Pact.crypto.restoreKeyPairFromSecretKey(
        loginDetails.privateKey
      );
      const balance = await pact.getBalance("coin", keyPair.publicKey);
      setUser({
        username: loginDetails?.userInfo?.name,
        publicKey: keyPair.publicKey,
        balance: balance,
      });
    } catch (error) {
      console.error(error, "login caught");
    } finally {
      setLoading(false);
    }
  };

  const loginForTransfer = async () => {
    setConnectingLoading(true);
    try {
      const { typeOfLogin, clientId, verifier } = verifierMap[GOOGLE];
      const loginDetails = await torus.torusdirectsdk.triggerLogin({
        typeOfLogin,
        verifier,
        clientId,
      });
      return loginDetails.privateKey;
    } catch (error) {
      console.error(error, "login caught");
    } finally {
      setConnectingLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        connectingLoading,
        login,
        logout,
        totalBalance,
        setTotalBalance,
        loginForTransfer,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
