import React, { useContext } from 'react';
import { Dimmer, Menu, Sidebar } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import { AuthContext } from '../../../contexts/AuthContext';
import { MAINNET, TESTNET } from '../../../contexts/NetworkContext';

import {
  DropdownIcon,
  HamburgerIcon,
  PowerIcon,
  CrossIcon,
} from '../../../assets';
import ToggleSwitchButton from '../../shared/ToogleSwitchButton';
import { useHistory, useLocation } from 'react-router';
import theme from '../../../styles/theme';
import CustomPopup from '../../shared/CustomPopup';
import { ViewportContext } from '../../../contexts/ViewportContext';
import { MENU_LIST_COMPONENT } from './MenuListComponents';
import Button from '../../shared/Button';

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

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    margin-left: 0px;
  }

  & > *:not(:last-child) {
    margin-right: 25px;
  }

  svg {
    align-self: baseline;
    margin-top: 15px;
  }

  .custom-sidebar {
    background: ${theme.backgroundGradient};

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

const SideBarContainer = styled.div`
  z-index: 100;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  padding: 15px;
`;

const MenuLabelContainer = styled.div`
  display: flex;
  flex-flow: row;

  justify-content: flex-start;
  width: 100%;

  & > *:not(:last-child) {
    align-self: center;
    margin-right: 10px;
  }

  & > *:last-child {
    margin-top: 0 !important;
    align-self: center;
    margin-right: 0px;
    position: absolute;
    right: 10px;
  }
`;

const BottomSidebarContainer = styled.div`
  display: flex;
  width: 100%;
  position: absolute;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  bottom: 25px;

  & > *:not(:last-child) {
    align-self: center;
    margin-top: 0 !important;
    margin-bottom: 10px;
  }

  & > *:last-child {
    margin-top: 0 !important;
    align-self: center;
  }
`;

const LogoutContainer = styled.div`
  display: flex;
  align-items: center;

  svg {
    margin: 0 15px 0 0;
  }
`;

const MenuItemsContainer = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
  justify-content: center;
  margin-top: 30px;
`;

const ToggleContainer = styled.div`
  display: flex;
  border: 0.5px solid #ffffff;
  /* box-shadow: ${theme.boxshadow}; */
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

const Header = ({ sideBarIsVisible, setSideBarIsVisible }) => {
  const auth = useContext(AuthContext);
  const viewport = useContext(ViewportContext);
  const history = useHistory();
  const url = useLocation();

  return (
    <HeaderContainer>
      <Dimmer active={sideBarIsVisible} style={{ zIndex: 1 }} />

      <LeftContainer>
        {viewport.isMobile ? (
          // MOBILE MENU
          <>
            <HamburgerIcon
              className='desktop-none'
              onClick={() => {
                setSideBarIsVisible(true);
              }}
            />
            <Sidebar
              as={Menu}
              style={{ display: 'flex', maxWidth: '50%' }}
              animation='overlay'
              direction='left'
              vertical
              className='custom-sidebar'
              onHide={() => setSideBarIsVisible(false)}
              visible={sideBarIsVisible}
            >
              <SideBarContainer>
                <MenuLabelContainer>
                  <HamburgerIcon
                    style={{ marginTop: '0px' }}
                    onClick={() => {
                      setSideBarIsVisible(false);
                    }}
                  />
                  <span style={{ color: '#fff' }}>Menu</span>
                  <CrossIcon
                    onClick={() => {
                      setSideBarIsVisible(false);
                    }}
                  />
                </MenuLabelContainer>
                <MenuItemsContainer>
                  {Object.values(MENU_LIST_COMPONENT).map((menu, index) => (
                    <Button
                      key={index}
                      background={
                        url.pathname === menu.route ? '#fff' : 'transparent'
                      }
                      color={
                        url.pathname === menu.route
                          ? theme.colors.primary
                          : '#fff'
                      }
                      border={url.pathname === menu.route ? '' : 'none'}
                      onClick={() => {
                        history.push(menu.route);
                      }}
                    >
                      {menu.name}
                    </Button>
                  ))}
                </MenuItemsContainer>
                <BottomSidebarContainer onClick={() => auth.logout()}>
                  <hr
                    style={{
                      display: 'flex',
                      width: '90%',
                      borderTop: '1px solid #fff',
                    }}
                  />
                  <Label
                    style={{
                      color: theme.colors.white,
                      fontSize: 16,
                    }}
                  >
                    {auth.user.username}
                  </Label>
                  <LogoutContainer>
                    <PowerIcon />
                    <span style={{ color: '#fff' }}>Log Out</span>
                  </LogoutContainer>
                </BottomSidebarContainer>
              </SideBarContainer>
            </Sidebar>
          </>
        ) : (
          // DESKTOP MENU
          Object.values(MENU_LIST_COMPONENT).map((menu, index) => (
            <Item
              key={index}
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
            {/* <Label
              style={{
                marginRight: "15px",
                color: theme.colors.white,
                fontSize: 16,
              }}
            >
              {auth.user.username}
            </Label>
             */}
          </Item>
        ) : (
          <Item>
            <CustomPopup
              trigger={
                <Label
                  style={{
                    color: theme.colors.white,
                    fontSize: 16,
                    alignItems: 'center',
                  }}
                >
                  {auth.user.username}
                  <DropdownIcon
                    style={{ marginLeft: '10px', marginBottom: '4px' }}
                  />
                </Label>
              }
              position='bottom right'
              onClick={() => auth.logout()}
              text='Log out'
            />
          </Item>
        )}
      </RightContainer>
    </HeaderContainer>
  );
};

export default Header;
