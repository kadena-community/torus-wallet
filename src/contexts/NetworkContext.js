import React, { createContext, useContext, useEffect, useState } from 'react';

export const MAINNET = {
    name: "mainnet",
    label: "Mainnet",
    networkID: process.env.REACT_APP_KADENA_NETWORK_ID_MAINNET,
    kadenaServer: process.env.REACT_APP_KADENA_SERVER_MAINNET
};
export const TESTNET = {
    name: "testnet",
    label: "Testnet",
    networkID: process.env.REACT_APP_KADENA_NETWORK_ID_TESTNET,
    kadenaServer: process.env.REACT_APP_KADENA_SERVER_TESTNET
};


const savedNetwork = localStorage.getItem("network");

export const NetworkContext = createContext(null);

export const NetworkProvider = (props) => {
    const [network, setNetwork] = useState(
        savedNetwork ? JSON.parse(savedNetwork) : TESTNET
    );

    
    const toggleNetwork = () => {
       switch (network.name) {
           case MAINNET.name:
               setNetwork(TESTNET);
               localStorage.setItem("network", JSON.stringify(TESTNET));
               break;
           case TESTNET.name:
               setNetwork(MAINNET);
               localStorage.setItem("network", JSON.stringify(MAINNET));
               break;
           default:
               console.log("ERROR: toggle network error")
               break;
       }
    }

    return (
        <NetworkContext.Provider value={{ network, toggleNetwork }}>
            {props.children}
        </NetworkContext.Provider>
    );
 }