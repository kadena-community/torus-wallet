import React, { createContext, useContext, useState } from 'react';
import Pact from 'pact-lang-api';
import { TorusContext } from './TorusContext';
import getBalance from '../util/getBalance';

const GOOGLE = "google";

  const verifierMap = {
    [GOOGLE]: {
      name: "Google",
      typeOfLogin: "google",
      verifier: process.env.REACT_APP_TORUS_VERIFIER,
      clientId: process.env.REACT_APP_TORUS_GOOGLE_CLIENT_ID,
    }
  };

export const AuthContext = createContext(null);

export const AuthProvider = (props) => {
    const [user, setUser] = useState (null);
    const [loading, setLoading] = useState (false);
    const torus = useContext(TorusContext);

    const login = async () => {
        setLoading(true);
        try {
            const { typeOfLogin, clientId, verifier } = verifierMap[GOOGLE];
            const loginDetails = await torus.torusdirectsdk.triggerLogin({
                typeOfLogin,
                verifier,
                clientId,
            });

            const keyPair = Pact.crypto.restoreKeyPairFromSecretKey(loginDetails.privateKey);
            const balance = await getBalance('coin', keyPair.publicKey);
            setUser({ username: loginDetails?.userInfo?.name, publicKey: keyPair.publicKey, balance: balance[0] });
        }
        catch (error) { console.error(error, "login caught"); }
        finally { setLoading(false); }
    }

    const logout = () => {
        setUser(null);
    }
    

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
 }