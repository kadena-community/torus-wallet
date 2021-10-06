import React from "react";
import styled from "styled-components/macro";
import { Modal as SUIModal, Button } from "semantic-ui-react";
import theme from "../../styles/theme";

const ModalContainer = styled(SUIModal)`
  border-radius: 10px !important;
  justify-content: center;
  width: auto !important;
`;

const HeaderTitle = styled.div`
  font-family: roboto-bold;
  font-size: 24px;
  color: ${({ theme: { colors } }) => colors.primary};
`;

const ContentContainer = styled.div`
  padding-top: 0px;
  border-radius: 10px;
  border: 2px solid #ffffff;
  border-right: 3px solid #ffffff;
`;

const Footer = styled.div`
  border-top: none;
  background-color: white;
  text-align: left;
  display: flex;
`;

const getButtonStyle = (type) => {
  switch (type) {
    case "cancel":
      return {
        backgroundColor: "white",
        textDecoration: "underline",
        color: theme.colors.primary,
        minWidth: 50,
      };
    case "confirm":
      return {
        backgroundColor: theme.colors.primary,
        color: "white",
        minWidth: 112,
      };

    default:
      return { backgroundColor: theme.colors.primary, color: "white" };
  }
};

const Modal = ({
  title,
  content,
  footer,
  buttons,
  footerStyle,
  contentStyle,
  params,
  open,
  loading,
  titleStyle,
  size,
  onOpen,
  onClose,
  children,
  mountNode,
  containerStyle,
}) => {
  return (
    <ModalContainer
      mountNode={mountNode}
      {...params}
      open={open}
      size={size}
      style={{ ...containerStyle, borderRadius: 0 }}
      onOpen={onOpen}
      className="classicModal"
      onClose={onClose}
    >
      {title && (
        <SUIModal.Header
          style={{ borderBottom: "none", padding: 24, ...titleStyle }}
          content={<HeaderTitle>{title}</HeaderTitle>}
        />
      )}
      <ContentContainer style={contentStyle}>
        {content || children}
      </ContentContainer>
      {buttons?.length > 0 && (
        <SUIModal.Actions
          style={{
            padding: 24,
            paddingTop: 0,
            borderTop: "none",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {buttons.map((button, index) => (
            <Button
              key={index}
              style={{ ...getButtonStyle(button.styleType), ...button.style }}
              disabled={loading}
              onClick={button.onClick}
            >
              {button.label}
            </Button>
          ))}
        </SUIModal.Actions>
      )}
      {footer && <Footer style={footerStyle}>{footer}</Footer>}
    </ModalContainer>
  );
};

export default Modal;
