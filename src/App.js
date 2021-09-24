import React from "react";
import "./App.css";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import GlobalStyle from "./styles/globalStyle";
import { TorusProvider } from "./contexts/TorusContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NetworkProvider } from "./contexts/NetworkContext";
import { PactProvider } from "./contexts/PactContext";
import { ViewportProvider } from "./contexts/ViewportContext";
import AppRouter from "./router/router";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <TorusProvider>
        <NetworkProvider>
          <PactProvider>
            <AuthProvider>
              <ViewportProvider>
                <AppRouter />
              </ViewportProvider>
            </AuthProvider>
          </PactProvider>
        </NetworkProvider>
      </TorusProvider>
    </ThemeProvider>
  );
}

export default App;
