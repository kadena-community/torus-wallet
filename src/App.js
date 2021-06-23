import React from "react";
import "./App.css";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import GlobalStyle from "./styles/globalStyle";
import { TorusProvider } from "./contexts/TorusContext";
import { AuthProvider } from "./contexts/AuthContext";
import SwitchContainer from "./containers/SwitchContainer";


function App() {


  return (
    <TorusProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <SwitchContainer/>
        </ThemeProvider>
      </AuthProvider>
    </TorusProvider>
      
  );
}

export default App;