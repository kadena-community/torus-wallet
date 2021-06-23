import React, {useContext} from "react";
import { Button, Popup } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import { ReactComponent as CogIcon } from "../assets/images/cog.svg";
import { ReactComponent as KDAIcon } from "../assets/images/k_blu.svg";
import { ReactComponent as CopyIcon } from "../assets/images/copy.svg";
import { ReactComponent as DropdownIcon } from "../assets/images/dropdown_icon.svg";
import { ReactComponent as HamburgerIcon } from "../assets/images/hamburger.svg";
import MyButton from "../components/shared/Button";
import {reduceBalance} from "../util/reduceBalance";
import reduceToken from "../util/reduceToken";
import { AuthContext } from "../contexts/AuthContext";


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

const Label = styled.span`
  font-size: 13px;
  font-family: montserrat-bold;
  text-transform: capitalize;
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  & > *:first-child {
    margin-right: 13px;
  }
  & > *:not(:first-child){
    margin-right: 40px;
  }
  & > *:not(:first-child):not(:last-child) {
    margin-right: 14px;
  }
  @media (min-width: ${({ theme: { mediaQueries } }) =>
      mediaQueries.mobileBreakpoint}) {
      margin-right: 0px;
    
  }
`;

const Item = styled.div`
  color: #FFFFFF;
  font-size: 14px;
  text-decoration: none;
  text-transform: capitalize;
  background: transparent;
  &.active {
    font-weight: bold;
  }
  &:hover {
    color: white;
    opacity: 0.7;
    cursor: pointer;
  }
`;

const ContentContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-flow: column;
  align: center;
  
`;

const KeyContainer = styled.div`
  margin-top: 20%;
  margin-bottom: 40px;
  display: flex;
  width: 100%;
  background: transparent;
  border: none !important;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    margin-top: 34%;
  }
`;

const MainContainer = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  opacity: 1;
  overflow: auto;
`;


const RowContainer = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row;
  justify-content: space-between;
  margin-bottom: 10px;
`;


const TitleContainer = styled.div`
  display: flex;
  justify-content: left;
  margin-bottom: 10px;
  width: 100%;
`;

const Title = styled.span`
  font: normal normal bold 32px/38px Roboto;
  letter-spacing: 0px;
  color: #FFFFFF;
  text-transform: capitalize;
`;


const BalanceCurrencyTitle = styled.span`
  font: normal normal bold 32px/38px Roboto;
  letter-spacing: 0px;
  color: #FFFFFF;
  text-transform: capitalize;
  opacity: 1;
  
`;

const CurrencyBalance = styled.span`
  font: normal normal bold 32px/38px Roboto;
  letter-spacing: 0px;
  color: #FFFFFF;
  opacity: 1;
`;
const CurrencyBalanceTokenName = styled.span`
  font: normal normal normal 24px/32px Roboto;
  letter-spacing: 0px;
  color: #FFFFFF;
  opacity: 1;
  vertical-align: middle;
  margin-left: 5px;
`;

/* const CurrencyBalanceInfo = styled.span`
  font: normal normal normal 16px/21px Roboto;
  letter-spacing: 0px;
  color: #FFFFFF;
  opacity: 1;
`; */


const FormContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
  /* gap: 32px; */
  padding: 20px 20px;
  border-radius: 24px;
  box-shadow: 0px 4px 56px #8383833D;
  align-items: center;
  justify-content: center;
  opacity: 1;
  background: transparent radial-gradient(closest-side at 31% -64%, #2B237C 0%, #251C72 31%, #0F054C 100%) 0% 0% no-repeat padding-box;;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  margin-top: 15px;
  width: 100%;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

 


function DashboardContainer (props) {

  const auth = useContext(AuthContext);


    return (
      
            <MainContainer>
              <HeaderContainer>
                <LeftContainer>
                  <Item exact className="mobile-none">
                    Home
                  </Item>
                  <Item className="mobile-none">Top up</Item>
                  <Item className="mobile-none">Transfer</Item>
                </LeftContainer>
                <RightContainer>
                  
                  
                  <Item to="#" className="mobile-none">
                    <Popup
                      basic
                      trigger={<CogIcon />}
                      on="click"
                      offset={[0, 4]}
                      position="bottom right"
                      style={{ backgroundColor: "rgb(37 29 100)" }}
                    >
                    <Item style={{ color: "#FFFFFF", backgroundColor: "rgb(37 29 100)" }} >Testnet</Item>
                    {/* <Item style={{ color: "#FFFFFF", backgroundColor: "rgb(37 29 100)", marginTop: "10px" }}>Mainnet</Item> */}
                    </Popup>
                  </Item>
                <Item className="mobile-none">
                    <Popup
                      basic
                      trigger={
                        <Label style={{ color: "white", fontSize: 16, alignItems: "center" }}>
                          {auth.user.username}
                          <DropdownIcon style={{ marginLeft: "10px", marginBottom: "4px" }}/>
                        </Label>
                      }
                      on="click"
                      offset={[0, 4]}
                      position="bottom right"
                      style={{  backgroundColor: "rgb(37 29 100)" }}
                    >
                    <Item style={{ color: "#FFFFFF", backgroundColor: "rgb(37 29 100)" }} onClick={() =>  auth.logout() }>Log out</Item>
                    </Popup>
                    
                  </Item>
                <Item className="desktop-none" style={{ marginRight: "70px"}}>
                    <Label style={{ marginRight: "15px", color: "#FFFFFF", fontSize: 16}}>{auth.user.username}</Label>
                    <Popup
                      basic
                      trigger={ <HamburgerIcon/>}
                      on="click"
                      offset={[0, 4]}
                      position="bottom right"
                      style={{  backgroundColor: "rgb(37 29 100)"}}
                    >
                    <Item style={{ color: "#FFFFFF", backgroundColor: "rgb(37 29 100)"}} onClick={() =>  auth.logout() }>Log out</Item>
                    </Popup>
                    
                  </Item>
                </RightContainer>
              </HeaderContainer>
                
            <ContentContainer>
              <KeyContainer>
                  <TitleContainer>
                    <Title>Your Public Key:</Title>
                  </TitleContainer>
                <FormContainer style={{ color: '#FFFFFF', flexFlow: "row" }} id="pubKey">
                  <div className="mobile-none">{auth.user.publicKey}</div>
                  <div className="desktop-none">{reduceToken(auth.user.publicKey)}</div>
                  <Popup
                    content='copied!'
                    on='click'
                    position='bottom right'
                    style={{ opacity: 0.7 }}
                    pinned
                    trigger={
                      <CopyIcon
                        style={{marginLeft: "35px"}}
                        onClick={() => { navigator.clipboard.writeText(auth.user.publicKey) }}
                      />}
                  />
                  
                </FormContainer>
                </KeyContainer>
              <TitleContainer>
                    <Title>Account Balance</Title>
              </TitleContainer>
              <FormContainer style={{ color: '#FFFFFF' }}>
                <RowContainer>
                  <BalanceCurrencyTitle><KDAIcon style={{ marginRight: "10px" }} />kadena</BalanceCurrencyTitle>
                  <CurrencyBalance className="mobile-none">{auth.user.balance}<CurrencyBalanceTokenName>KDA</CurrencyBalanceTokenName></CurrencyBalance>
                  <CurrencyBalance className="desktop-none" style={{ marginLeft: "10px" }}>{reduceBalance(auth.user.balance)}<CurrencyBalanceTokenName>KDA</CurrencyBalanceTokenName></CurrencyBalance>
                </RowContainer>
                {/* <RowContainer>
                  <CurrencyBalanceInfo style={{ color: '#FFFFFF' }}>1 KDA = {reduceBalance(kdaValue)} $</CurrencyBalanceInfo>
                  <CurrencyBalanceInfo>{reduceBalance(auth.user.balance*kdaValue)} $</CurrencyBalanceInfo>
                </RowContainer> */}
                  <ButtonContainer>
                    <Button.Group fluid>
                      <MyButton disabled buttonStyle={{ marginRight: "10px"  }}>
                            Top up
                        </MyButton>
                        <MyButton disabled buttonStyle={{ marginLeft: "10px"  }}>
                            Transfer
                        </MyButton>
                    </Button.Group>
                  </ButtonContainer>
                 </FormContainer>
                
            </ContentContainer>
                <ButtonContainer >
                  <a href="https://faucet.testnet.chainweb.com/" target="_blank" rel="noreferrer">
                    <MyButton>
                      Go to Testnet Faucet
                    </MyButton>
                  </a>
                </ButtonContainer>
                
            </MainContainer>
            
    );
  
}

export default DashboardContainer;