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
import NotificationRender from "./components/notification/NotificationRender";
import AppRouter from "./router/router";
import { ModalConsumer, ModalProvider } from "./contexts/ModalContext";
import Modal from "./components/shared/Modal";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <NotificationRender>
        <TorusProvider>
          <ModalProvider>
            <NetworkProvider>
              <PactProvider>
                <AuthProvider>
                  <ViewportProvider>
                    <AppRouter />
                    <ModalConsumer>
                      {(value) => (
                        <Modal
                          mountNode={value?.mountNode}
                          open={value.open}
                          loading={value.loading}
                          title={value.title}
                          content={value.content}
                          buttons={value.buttons}
                          contentStyle={value.contentStyle}
                          footer={value.footer}
                          onClose={value.closeModal || value.onClose}
                        />
                      )}
                    </ModalConsumer>
                  </ViewportProvider>
                </AuthProvider>
              </PactProvider>
            </NetworkProvider>
          </ModalProvider>
        </TorusProvider>
      </NotificationRender>
    </ThemeProvider>
  );
}

export default App;
