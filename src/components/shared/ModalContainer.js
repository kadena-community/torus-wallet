import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components/macro";
import theme from "../../styles/theme";

const Container = styled.div`
  display: flex;
  flex-flow: column;
  padding: 20px 20px;
  width: 100%;
  border-radius: 10px;
  opacity: 1;
  background: ${theme.backgroundGradient};
  color: ${({ theme: { colors } }) => colors.white};

  ::-webkit-scrollbar {
    display: none;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  width: 100%;
  margin-bottom: 24px;
`;

const Title = styled.span`
  font: ${({ theme: { macroFont } }) => macroFont.highBold};
  text-transform: capitalize;
  color: ${({ theme: { colors } }) => colors.white};
`;

const Description = styled.span`
  font: ${({ theme: { macroFont } }) => macroFont.smallBold};

  margin-bottom: 24px;
`;

const ModalContainer = ({
  title,
  description,
  containerStyle,
  titleStyle,
  descriptionStyle,
  children,
  onBack,
  onClose,
}) => {
  return (
    <Container style={containerStyle}>
      <HeaderContainer>
        {title && <Title style={titleStyle}>{title}</Title>}
      </HeaderContainer>

      {description && (
        <Description style={descriptionStyle}>{description}</Description>
      )}
      {children}
    </Container>
  );
};

ModalContainer.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
};

ModalContainer.defaultProps = {
  title: "",
  onClose: null,
};

export default ModalContainer;
