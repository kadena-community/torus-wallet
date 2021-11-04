import React from 'react';
import './App.css';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyle from './styles/globalStyle';
import { TorusProvider } from './contexts/TorusContext';
import { AuthProvider } from './contexts/AuthContext';
import { NetworkProvider } from './contexts/NetworkContext';
import { PactProvider } from './contexts/PactContext';
import { ViewportProvider } from './contexts/ViewportContext';
import NotificationRender from './components/notification/NotificationRender';
import AppRouter from './router/router';
import { ModalConsumer, ModalProvider } from './contexts/ModalContext';
import Modal from './components/shared/Modal';
import {
  RightModalConsumer,
  RightModalProvider,
} from './contexts/RightModalContext';
import RightModal from './components/right-modal-notification/RightModal';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <RightModalProvider>
        <NotificationRender>
          <TorusProvider>
            <ModalProvider>
              <NetworkProvider>
                <PactProvider>
                  <AuthProvider>
                    <ViewportProvider>
                      <AppRouter />
                      <RightModalConsumer>
                        {(value) => (
                          <RightModal
                            mountNode={
                              value?.mountNode ||
                              document.getElementById('main-content')
                            }
                            open={value.open || false}
                            title={value.title}
                            content={value?.content ?? null}
                            containerStyle={value.containerStyle}
                            contentStyle={value.contentStyle}
                            titleStyle={value.titleStyle}
                            onClose={value.onClose || value.closeModal}
                          />
                        )}
                      </RightModalConsumer>
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
      </RightModalProvider>
    </ThemeProvider>
  );
}

export default App;
