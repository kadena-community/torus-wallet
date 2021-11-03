/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import styled from 'styled-components/macro';
import { Button as SUIButton } from 'semantic-ui-react';
import theme from '../../styles/theme';

const StyledButton = styled(SUIButton)`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold} !important;
  font-size: ${({ fontSize }) =>
    fontSize ? fontSize + ' !important' : '16px !important'};
  color: ${({ color, inverted }) => {
    if (color) return color + ' !important';
    if (inverted) return `${theme.colors.primary} !important`;
    return `${theme.colors.white} !important`;
  }};
  background: ${({
    disabled,
    background,
    inverted,
    theme: { buttonBackgroundGradient },
  }) => {
    if (disabled) return 'transparent !important';
    if (background) return background + ' !important';
    if (inverted) return `${theme.colors.white} !important`;
    return buttonBackgroundGradient + '!important';
  }};
  border-radius: 5px !important;
  opacity: 1 !important;
  border: ${({ border }) => {
    if (border) return border + ' !important';
    return `1px solid ${theme.colors.white} !important`;
  }};
  box-shadow: ${({ boxshadow }) => {
    if (boxshadow) return boxshadow + ' !important';
    return theme.boxshadow;
  }};
`;

const Button = ({
  props,
  disabled,
  border,
  boxshadow,
  buttonStyle,
  background,
  color,
  fontSize,
  size,
  type,
  children,
  onClick,
  loading,
  inverted,
  hover,
}) => {
  return (
    <StyledButton
      {...props}
      disabled={disabled}
      background={background}
      color={color}
      size={size}
      fontSize={fontSize}
      style={buttonStyle}
      onClick={onClick}
      loading={loading}
      border={border}
      type={type}
      boxshadow={boxshadow}
      hover={hover}
      inverted={inverted}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
