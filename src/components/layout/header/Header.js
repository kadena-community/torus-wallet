import React, { useContext } from "react";
import { Popup } from "semantic-ui-react";
import styled from "styled-components/macro";
import { AuthContext } from "../../../contexts/AuthContext";
import { MAINNET, TESTNET } from "../../../contexts/NetworkContext";
import { ReactComponent as DropdownIcon } from "../../../assets/images/dropdown_icon.svg";
import { ReactComponent as HamburgerIcon } from "../../../assets/images/hamburger.svg";
import ToggleSwitchButton from "../../shared/ToogleSwitchButton";
import {
  ROUTE_DASHBOARD,
  ROUTE_HISTORY,
  ROUTE_TRANSFER,
} from "../../../router/routes";
import { useHistory } from "react-router";

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin: 25px 80px 75px;
  /* min-height: ${({ theme: { header } }) => `${header.height}px`}; */
  width: calc(100% - 3em);
  /* @media (min-width: ${({ theme: { mediaQueries } }) =>
    mediaQueries.mobileBreakpoint}) {
    width: inherit;
    left: unset;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) =>
    `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  } */
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 25px;
  & > *:not(:last-child) {
    margin-right: 25px;
  }
`;

const Item = styled.div`
  color: #ffffff;
  text-decoration: none;
  text-transform: capitalize;
  background: transparent;
  font: normal normal bold 16px/20px roboto-bold;
  &.active {
    font-weight: bold;
  }
  &:hover {
    color: white;
    opacity: 0.7;
    cursor: pointer;
  }
`;

const RightContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  & > *:first-child {
    margin-right: 30px;
  }
  & > *:not(:first-child) {
    margin-right: 40px;
  }
  & > *:not(:first-child):not(:last-child) {
    margin-right: 14px;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
    & > *:first-child {
      margin-bottom: 10px;
      margin-right: 70px;
    }
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  border: 1px solid #fcfcfc;
  box-shadow: 0px 2px 6px #0000001a;
  border-radius: 5px;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    justify-content: center;
    align-items: center;
  }
`;

const Label = styled.span`
  font-size: 13px;
  font-family: roboto-bold;
  text-transform: capitalize;
`;

const Header = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  return (
    <HeaderContainer>
      <LeftContainer>
        <Item
          exact
          className="mobile-none"
          onClick={() => {
            history.push(ROUTE_DASHBOARD);
          }}
        >
          Home
        </Item>
        <Item className="mobile-none" onClick={() => {}}>
          Top up
        </Item>
        <Item
          className="mobile-none"
          onClick={() => {
            history.push(ROUTE_TRANSFER);
          }}
        >
          Transfer
        </Item>
        <Item
          className="mobile-none"
          onClick={() => {
            history.push(ROUTE_HISTORY);
          }}
        >
          History
        </Item>
      </LeftContainer>
      <RightContainer>
        <ToggleContainer>
          <ToggleSwitchButton
            label1={MAINNET.label}
            label2={TESTNET.label}
            background="#FFFFFF"
            onChange={() => {}}
          />
        </ToggleContainer>
        <Item className="mobile-none">
          <Popup
            basic
            trigger={
              <Label
                style={{
                  color: "white",
                  fontSize: 16,
                  alignItems: "center",
                }}
              >
                {auth.user.username}
                <DropdownIcon
                  style={{ marginLeft: "10px", marginBottom: "4px" }}
                />
              </Label>
            }
            on="click"
            offset={[0, 4]}
            position="bottom right"
            style={{ backgroundColor: "rgb(37 29 100)" }}
          >
            <Item
              style={{
                color: "#FFFFFF",
                backgroundColor: "rgb(37 29 100)",
              }}
              onClick={() => auth.logout()}
            >
              Log out
            </Item>
          </Popup>
        </Item>
        <Item className="desktop-none" style={{ marginRight: "70px" }}>
          <Label
            style={{
              marginRight: "15px",
              color: "#FFFFFF",
              fontSize: 16,
            }}
          >
            {auth.user.username}
          </Label>
          <Popup
            basic
            trigger={<HamburgerIcon />}
            on="click"
            offset={[0, 4]}
            position="bottom right"
            style={{ backgroundColor: "rgb(37 29 100)" }}
          >
            <Item
              style={{
                color: "#FFFFFF",
                backgroundColor: "rgb(37 29 100)",
              }}
              onClick={() => auth.logout()}
            >
              Log out
            </Item>
          </Popup>
        </Item>
      </RightContainer>
    </HeaderContainer>
  );
};

export default Header;
