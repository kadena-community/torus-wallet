import React, { useContext, useState } from "react";
import { Divider, Menu, Sidebar } from "semantic-ui-react";
import styled from "styled-components/macro";
import { AuthContext } from "../../../contexts/AuthContext";
import { MAINNET, TESTNET } from "../../../contexts/NetworkContext";

import { DropdownIcon, HamburgerIcon, PowerIcon } from "../../../assets";
import ToggleSwitchButton from "../../shared/ToogleSwitchButton";
import { useHistory } from "react-router";
import theme from "../../../styles/theme";
import CustomPopup from "../../shared/CustomPopup";
import { ViewportContext } from "../../../contexts/ViewportContext";
import { MENU_LIST_COMPONENT } from "./MenuListComponents";

const HeaderContainer = styled.div`
  position: sticky;
  z-index: 999;
  top: 0;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin: 25px 75px;
  width: calc(100% - 3em);

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel + 1}px`}) {
    margin: 25px 25px 0 25px;
  }
`;

const LeftContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 15px;
  & > *:not(:last-child) {
    margin-right: 25px;
  }

  svg {
    align-self: baseline;
    margin-top: 15px;
  }

  .custom-sidebar {
    background: ${theme.backgroundGradient};

    -webkit-text-fill-color: ${({ theme: { colors } }) => colors.white};
    text-decoration: none;
    text-transform: capitalize;
    font: 16px ${theme.fontFamily.bold};
  }
`;

const Item = styled.div`
  color: ${({ theme: { colors } }) => colors.white};
  text-decoration: none;
  text-transform: capitalize;
  background: transparent;
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
    align-items: flex-end;
    & > *:first-child {
      margin-bottom: 10px;
      margin-right: 0px;
    }
    & > *:not(:first-child) {
      margin-right: 0px;
    }
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  border: 1px solid #fcfcfc;
  box-shadow: ${theme.boxshadow};
  border-radius: 5px;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    justify-content: center;
    align-items: center;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel + 1}px`}) {
    margin-right: 0 !important;
  }
`;

const Label = styled.span`
  font-size: 13px;
  font-family: ${({ theme: { fontFamily } }) => fontFamily.bold};
  text-transform: capitalize;
`;

const Header = () => {
  const auth = useContext(AuthContext);
  const viewport = useContext(ViewportContext);
  const history = useHistory();
  const [sideBarIsVisible, setSideBarIsVisible] = useState(false);

  return (
    <HeaderContainer>
      <LeftContainer>
        {viewport.isMobile ? (
          // MOBILE MENU
          <>
            <HamburgerIcon
              className="desktop-none"
              onClick={() => {
                setSideBarIsVisible(true);
              }}
            />
            <Sidebar
              as={Menu}
              animation="overlay"
              direction="left"
              vertical
              className="custom-sidebar"
              width="thin"
              onHide={() => setSideBarIsVisible(false)}
              visible={sideBarIsVisible}
            >
              <Divider/>
              {Object.values(MENU_LIST_COMPONENT).map((menu) => (
                <Menu.Item
                  as="a"
                  onClick={() => {
                    history.push(menu.route);
                  }}
                >
                  {menu.name}
                </Menu.Item>
              ))}
              <Divider/>
              <Menu.Item
                onClick={() => auth.logout()}
              >
                Log Out
              </Menu.Item>
            </Sidebar>
          </>
        ) : (
          // DESKTOP MENU
          Object.values(MENU_LIST_COMPONENT).map((menu) => (
            <Item
              exact
              onClick={() => {
                history.push(menu.route);
              }}
            >
              {menu.name}
            </Item>
          ))
        )}
      </LeftContainer>
      <RightContainer>
        <ToggleContainer>
          <ToggleSwitchButton
            label1={MAINNET.label}
            label2={TESTNET.label}
            background={theme.colors.white}
            onChange={() => {}}
          />
        </ToggleContainer>
        {viewport.isMobile ? (
          <Item>
            <Label
              style={{
                marginRight: "15px",
                color: theme.colors.white,
                fontSize: 16,
              }}
            >
              {auth.user.username}
            </Label>
            
          </Item>
        ) : (
          <Item>
            <CustomPopup
              trigger={
                <Label
                    style={{
                    color: theme.colors.white,
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
              position="bottom right"
              onClick={() => auth.logout()}
              text="Log out"
            />
          </Item>
        )}
      </RightContainer>
    </HeaderContainer>
  );
};

export default Header;
