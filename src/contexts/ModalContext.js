import React, { useState, createContext } from "react";
import { theme } from "../styles/theme";

export const ModalContext = createContext();

const initialState = {
  open: false,
  loading: false,
  title: "",
  content: null,
  contentStyle: {
    fontFamily: theme.fontFamily.regular,
    fontSize: 16,
    color: theme.colors.primary,
  },
  buttons: null,
  footer: null,
};

export const ModalProvider = (props) => {
  const [state, setState] = useState(initialState);

  const openModal = (settings) => {
    setState((prev) => ({ ...prev, ...settings, open: true }));
  };

  const closeModal = () => {
    setState(initialState);
  };

  const setIsLoading = (value) => {
    if (value === undefined)
      setState((prev) => ({ ...prev, loading: !prev.loading }));
    else setState((prev) => ({ ...prev, loading: value }));
  };

  return (
    <ModalContext.Provider
      value={{
        ...state,
        openModal,
        closeModal,
        setIsLoading,
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export const ModalConsumer = ModalContext.Consumer;
