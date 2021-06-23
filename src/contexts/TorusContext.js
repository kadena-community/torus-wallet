import React, { createContext, useState, useEffect } from 'react';
import TorusSdk from "@toruslabs/torus-direct-web-sdk";

export const TorusContext = createContext(null);

export const TorusProvider = (props) => {
    const [torusdirectsdk, setTorusdirectsdk] = useState(null);

    useEffect(() => {
        const init = async () => {
        try {
        const torusDirectSdk = new TorusSdk({
            baseUrl: `${window.location.origin}/serviceworker`,
            enableLogging: true,
            redirectToOpener: true,
            network: process.env.REACT_APP_TORUS_NETWORK,
        });

        await torusDirectSdk.init();
        
        setTorusdirectsdk(torusDirectSdk);
        } catch (error) {
        console.error(error, "mounted caught");
        }
        };
        init();
    }, []);

    return (
        <TorusContext.Provider value={{ torusdirectsdk }}>
            {props.children}
        </TorusContext.Provider>
    );
 }