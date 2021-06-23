/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import styled from "styled-components/macro";
import { Button as SUIButton } from "semantic-ui-react";

const StyledButton = styled(SUIButton)`
  font-family: montserrat-bold !important;
  font-size: ${({ fontSize }) =>
    fontSize ? fontSize + " !important" : "16px !important"};
  color: ${({ color }) => (color ? color + " !important" : "white !important")};
  background: ${({
    disabled,
    background,
    theme: { buttonBackgroundGradient },
  }) => {
    if (background) return background + " !important";
    if (disabled) return "transparent !important";
    return buttonBackgroundGradient + "!important";
  }};
  border-radius: 5px !important;
  opacity: 1 !important;
  border: ${({
    border,
  }) => {
    if (border) return border + " !important";
    return "1px solid #FFFFFF !important";
  }};
  box-shadow: ${({
    boxShadow,
  }) => {
  if (boxShadow) return boxShadow + " !important";
  return "0px 2px 6px #0000001A";
  }};
  /* box-shadow: 0 0 4px #FFFFFF !important; */
  /* :hover {
    opacity: ${({ hover }) => (hover ? 0.7 : 1.0) + " !important"};
    cursor: pointer;
  } */
`;

const Button = ({
  props,
  disabled,
  border,
  boxShadow,
  buttonStyle,
  background,
  color,
  fontSize,
  children,
  onClick,
  loading,
  hover,
}) => {
  return (
    <StyledButton
      {...props}
      disabled={disabled}
      background={background}
      color={color}
      fontSize={fontSize}
      style={buttonStyle}
      onClick={onClick}
      loading={loading}
      border={border}
      boxShadow={boxShadow}
      hover={hover}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
