import React, { createContext, useContext, useEffect, useState } from 'react';

export const ViewportContext = createContext(null);

export const  ViewportProvider = (props) => {
    const [width, setWidth] = useState(window.innerWidth);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const handleWindowResize = () => {
        setWidth(window.innerWidth);
        setIsMobile(window.innerWidth <= 768);
    }

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, [])

    return (
        <ViewportContext.Provider value={{ width, isMobile }}>
            {props.children}
        </ViewportContext.Provider>
    );
 }