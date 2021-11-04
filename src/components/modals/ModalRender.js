import React from 'react';
import { ModalConsumer, ModalProvider } from '../../contexts/ModalContext';
import Modal from '../shared/Modal';

const ModalRender = ({ children }) => {
  return (
    <ModalProvider>
      {children}
      <ModalConsumer>
        {(value) => (
          <Modal
            open={value.open}
            loading={value.loading}
            title={value.title}
            content={value.content}
            buttons={value.buttons}
            contentStyle={value.contentStyle}
            footer={value.footer}
            onClose={value.onClose || value.closeModal}
          />
        )}
      </ModalConsumer>
    </ModalProvider>
  );
};

export default ModalRender;
