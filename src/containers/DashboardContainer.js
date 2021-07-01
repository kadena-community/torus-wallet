import React, {useContext, useEffect, useState} from "react";
import { Button, Dimmer, Popup, Loader } from 'semantic-ui-react';
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
import ToggleSwitchButton from "../components/shared/ToogleSwitchButton";
import { NetworkContext, MAINNET, TESTNET } from "../contexts/NetworkContext";

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
  font-family: roboto-bold;
  text-transform: capitalize;
`;

const RightContainer = styled.div`
  display: flex;
  flex-flow: row;
  align-items: center;
  & > *:first-child {
    margin-right: 30px;
  }
  & > *:not(:first-child){
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

const Item = styled.div`
  color: #FFFFFF;
  /* font-size: 14px; */
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

const ContentContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-flow: column;
  align: center;

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    margin-top: 30px;
  }

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
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
    justify-content: left;
    align-items: flex-start;
  }
`;


const TitleContainer = styled.div`
  display: flex;
  justify-content: left;
  align-items: flex-start;
  flex-flow: column;
  margin-bottom: 10px;
  width: 100%;
`;

const Title = styled.span`
  font: normal normal bold 32px/38px roboto-bold;
  letter-spacing: 0px;
  color: #FFFFFF;
  text-transform: capitalize;
`;

const SubTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row;
  margin: 10px 0px;
  width: 100%;
`;

const SubTitle = styled.span`
  font: normal normal bold 24px/28px roboto-bold;
  letter-spacing: 0px;
  color: #FFFFFF;
  opacity: 1;
`;

const ChainBalanceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row;
  margin: 10px 0px;
  width: 100%;
`;

const ChainName = styled.div`
  color: #FFFFFF;
  text-decoration: none;
  text-transform: capitalize;
  background: transparent;
  font: normal normal bold 16px/20px roboto-bold;
  margin-right: 25px;
  &.active {
    font-weight: bold;
  }
  &:hover {
    color: white;
    opacity: 0.7;
    cursor: pointer;
  }
`;

const BalanceCurrencyTitle = styled.span`
  font: normal normal bold 32px/38px roboto-bold;
  letter-spacing: 0px;
  color: #FFFFFF;
  text-transform: capitalize;
  opacity: 1;

`;

const CurrencyBalance = styled.span`
  font: normal normal bold 32px/38px roboto-bold;
  letter-spacing: 0px;
  color: #FFFFFF;
  opacity: 1;
`;
const CurrencyBalanceTokenName = styled.span`
  font: normal normal normal 24px/32px roboto-regular;
  letter-spacing: 0px;
  color: #FFFFFF;
  opacity: 1;
  vertical-align: middle;
  margin-left: 5px;
`;

/* const CurrencyBalanceInfo = styled.span`
  font: normal normal normal 16px/21px roboto-regular;
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


const ToggleContainer = styled.div`
  display: flex;
  border: 1px solid #FCFCFC;
  box-shadow: 0px 2px 6px #0000001A;
  border-radius: 5px;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    justify-content: center;
    align-items: center;
  }
  
`;



function DashboardContainer (props) {

  const auth = useContext(AuthContext);
  const networkContext = useContext(NetworkContext);

  const [totalBalance, setTotalBalance] = useState(0);

  /* useEffect(() => {
      getTotBalance()
  }, [networkContext.network])

  const getTotBalance = () => {
    let tot = 0;
    for (let i = 0; i < auth.user.balance.length; i++) {
      tot += parseFloat(auth.user.balance[i])
    }
    setTotalBalance(tot)
  } */

    return (

      <>
      
            {auth.loading && (
              <Dimmer active style={{ borderRadius: "16px" }}>
                <Loader content='Switching Network..' />
              </Dimmer>
            )}
          

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

                  <ToggleContainer >
                    <ToggleSwitchButton 
                      label1= {MAINNET.label}
                      label2= {TESTNET.label}
                      background= "#FFFFFF"
                      onChange = { () => {}}
                    />
                  </ToggleContainer>
                  
                  {/* <Item to="#" className="mobile-none">

                    <Popup
                      basic
                      trigger={<CogIcon />}
                      on="click"
                      offset={[0, 4]}
                      position="bottom right"
                      style={{ backgroundColor: "rgb(37 29 100)" }}
                    >
                    <Item style={{ color: "#FFFFFF", backgroundColor: "rgb(37 29 100)" }} >Testnet</Item>
                    <Item style={{ color: "#FFFFFF", backgroundColor: "rgb(37 29 100)", marginTop: "10px" }}>Mainnet</Item> 
                    </Popup>
                  </Item> */}
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
                    <Title>Your Public Key (TESTNET):</Title>
                  </TitleContainer>
                <FormContainer style={{ color: '#FFFFFF', flexFlow: "row" }} id="pubKey">
                  <div className="mobile-none">{auth.user.publicKey}</div>
                  <div className="desktop-none">{reduceToken(auth.user.publicKey)}</div>
                  <Popup className="mobile-none"
                    content='copied!'
                    on='click'
                    position='bottom right'
                    style={{ opacity: 0.7 }}
                    pinned
                    trigger={
                      <CopyIcon className="mobile-none"
                        style={{marginLeft: "35px"}}
                        onClick={() => { navigator.clipboard.writeText(auth.user.publicKey) }}
                      />}
                  />

                </FormContainer>
                </KeyContainer>
              <TitleContainer>
                    <Title>Account Balance</Title>
                    {networkContext.network.name === "mainnet" && !auth.loading && (
                      <SubTitleContainer>
                      <Popup
                      basic
                      trigger={
                        <SubTitle>Total <DropdownIcon style={{ marginLeft: "10px", marginBottom: "4px" }}/></SubTitle>
                      }
                      on="click"
                      offset={[0, 1]}
                      position="bottom left"
                      style={{  
                        height: "196px",
                        overflow: "auto",
                        background: "transparent radial-gradient(closest-side at 31% -64%, #201669 0%, #251C72 31%, #0F054C 100%) 0% 0% no-repeat padding-box",
                        boxShadow: "0px 4px 56px #8383833D",
                        border: "1px solid #110750",
                        borderRadius: "10px"
                      }}
                      >
                      {auth.user.balance.map((bal, index) => {
                        return (
                          <ChainBalanceContainer key={index}>
                            <ChainName>Chain {index}</ChainName>
                            <Item>{reduceBalance(bal)}</Item>
                          </ChainBalanceContainer>
                        )
                        
                      })}
                       {/*  
                        <ChainBalanceContainer>
                          <ChainName>Chain 0</ChainName>
                          <Item>1233333.8888</Item>
                        </ChainBalanceContainer>
                        <ChainBalanceContainer>
                          <ChainName>Chain 1</ChainName>
                          <Item>3.00</Item>
                        </ChainBalanceContainer> */}
                        
                      </Popup>
                      
                      <SubTitle className="mobile-none">{auth.user.balance.reduce((a, b) => { return parseFloat(a) + parseFloat(b) })} KDA</SubTitle>
                      <SubTitle className="desktop-none">{reduceBalance(auth.user.balance.reduce((a, b) => { return parseFloat(a) + parseFloat(b) }))} KDA</SubTitle>
                    </SubTitleContainer>
                    )}
                    
              </TitleContainer>
              <FormContainer style={{ color: '#FFFFFF' }}>
                <RowContainer>
                  <BalanceCurrencyTitle><KDAIcon style={{ marginRight: "10px" }} />kadena</BalanceCurrencyTitle>
                  <CurrencyBalance className="mobile-none">{auth.user.balance.reduce((a, b) => { return parseFloat(a) + parseFloat(b) })}<CurrencyBalanceTokenName>KDA</CurrencyBalanceTokenName></CurrencyBalance>
                  <CurrencyBalance className="desktop-none">{reduceBalance(auth.user.balance.reduce((a, b) => { return parseFloat(a) + parseFloat(b) }))}<CurrencyBalanceTokenName>KDA</CurrencyBalanceTokenName></CurrencyBalance>
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

            {networkContext.network.name === "testnet" && !auth.loading && (
              <ButtonContainer >
                <a href="https://faucet.testnet.chainweb.com/" target="_blank" rel="noreferrer">
                  <MyButton>
                    Go to Testnet Faucet
                  </MyButton>
                </a>
              </ButtonContainer>
            )}
            </MainContainer>
        </>

    );

}

export default DashboardContainer;
