import React from "react";
import { Popup } from "semantic-ui-react";
import styled from "styled-components";
import theme from "../../styles/theme";

const Item = styled.div`
  color: ${({ theme: { colors } }) => colors.white};
  text-decoration: none;
  text-transform: capitalize;
  font: ${({ theme: { macroFont } }) => macroFont.tinyBold};
  &.active {
    font-weight: bold;
  }
  &:hover {
    color: white;
    opacity: 0.7;
    cursor: pointer;
  }
`;

const CustomPopup = ({ trigger, position, onClick, text, style }) => {
  return (
    <Popup
      basic
      trigger={trigger}
      on="click"
      offset={[0, 4]}
      position={position}
      style={{
        background: theme.colors.popupColor,
        ...style,
      }}
    >
      <Item onClick={onClick}>{text} </Item>
    </Popup>
  );
};

export default CustomPopup;
