import React, { useContext, useState } from "react";
import { Button, Dimmer, Popup, Loader } from "semantic-ui-react";
import { useHistory } from "react-router";
import styled from "styled-components/macro";
import { ReactComponent as KDAIcon } from "../assets/images/k_blu.svg";
import { ReactComponent as CopyIcon } from "../assets/images/copy.svg";
import { ReactComponent as DropdownIcon } from "../assets/images/dropdown_icon.svg";
import MyButton from "../components/shared/Button";
import { reduceBalance } from "../util/reduceBalance";
import reduceToken from "../util/reduceToken";
import { AuthContext } from "../contexts/AuthContext";
import { NetworkContext } from "../contexts/NetworkContext";
import Header from "../components/layout/header/Header";
import { ROUTE_TRANSFER } from "../router/routes";

const Item = styled.div`
  color: #ffffff;
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
  color: #ffffff;
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
  color: #ffffff;
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
  color: #ffffff;
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
  color: #ffffff;
  text-transform: capitalize;
  opacity: 1;
`;

const CurrencyBalance = styled.span`
  font: normal normal bold 32px/38px roboto-bold;
  letter-spacing: 0px;
  color: #ffffff;
  opacity: 1;
`;
const CurrencyBalanceTokenName = styled.span`
  font: normal normal normal 24px/32px roboto-regular;
  letter-spacing: 0px;
  color: #ffffff;
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
  box-shadow: 0px 4px 56px #8383833d;
  align-items: center;
  justify-content: center;
  opacity: 1;
  background: transparent
    radial-gradient(
      closest-side at 31% -64%,
      #2b237c 0%,
      #251c72 31%,
      #0f054c 100%
    )
    0% 0% no-repeat padding-box;
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

function DashboardContainer(props) {
  const history = useHistory();
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
          <Loader content="Switching Network.." />
        </Dimmer>
      )}

      <MainContainer>
        <Header />

        <ContentContainer>
          <KeyContainer>
            <TitleContainer>
              <Title>Your Public Key:</Title>
            </TitleContainer>
            <FormContainer
              style={{ color: "#FFFFFF", flexFlow: "row" }}
              id="pubKey"
            >
              <div className="mobile-none">{auth.user.publicKey}</div>
              <div className="desktop-none">
                {reduceToken(auth.user.publicKey)}
              </div>
              <Popup
                className="mobile-none"
                content="copied!"
                on="click"
                position="bottom right"
                style={{ opacity: 0.7 }}
                pinned
                trigger={
                  <CopyIcon
                    className="mobile-none"
                    style={{ marginLeft: "35px" }}
                    onClick={() => {
                      navigator.clipboard.writeText(auth.user.publicKey);
                    }}
                  />
                }
              />
            </FormContainer>
          </KeyContainer>
          <TitleContainer>
            <Title>Account Balance</Title>
            {!auth.loading && (
              <SubTitleContainer>
                <Popup
                  basic
                  trigger={
                    <SubTitle>
                      Total
                      <DropdownIcon
                        style={{ marginLeft: "10px", marginBottom: "4px" }}
                      />
                    </SubTitle>
                  }
                  on="click"
                  offset={[0, 1]}
                  position="bottom left"
                  style={{
                    height: "196px",
                    overflow: "auto",
                    background:
                      "transparent radial-gradient(closest-side at 31% -64%, #201669 0%, #251C72 31%, #0F054C 100%) 0% 0% no-repeat padding-box",
                    boxShadow: "0px 4px 56px #8383833D",
                    border: "1px solid #110750",
                    borderRadius: "10px",
                  }}
                >
                  {auth.user.balance.map((bal, index) => {
                    return (
                      <ChainBalanceContainer key={index}>
                        <ChainName>Chain {index}</ChainName>
                        <Item>{reduceBalance(bal)}</Item>
                      </ChainBalanceContainer>
                    );
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

                <SubTitle className="mobile-none">
                  {auth.user.balance.reduce((a, b) => {
                    return parseFloat(a) + parseFloat(b);
                  })}{" "}
                  KDA
                </SubTitle>
                <SubTitle className="desktop-none">
                  {reduceBalance(
                    auth.user.balance.reduce((a, b) => {
                      return parseFloat(a) + parseFloat(b);
                    })
                  )}{" "}
                  KDA
                </SubTitle>
              </SubTitleContainer>
            )}
          </TitleContainer>
          <FormContainer style={{ color: "#FFFFFF" }}>
            <RowContainer>
              <BalanceCurrencyTitle>
                <KDAIcon style={{ marginRight: "10px" }} />
                kadena
              </BalanceCurrencyTitle>
              <CurrencyBalance className="mobile-none">
                {auth.user.balance.reduce((a, b) => {
                  return parseFloat(a) + parseFloat(b);
                })}
                <CurrencyBalanceTokenName>KDA</CurrencyBalanceTokenName>
              </CurrencyBalance>
              <CurrencyBalance className="desktop-none">
                {reduceBalance(
                  auth.user.balance.reduce((a, b) => {
                    return parseFloat(a) + parseFloat(b);
                  })
                )}
                <CurrencyBalanceTokenName>KDA</CurrencyBalanceTokenName>
              </CurrencyBalance>
            </RowContainer>
            {/* <RowContainer>
                  <CurrencyBalanceInfo style={{ color: '#FFFFFF' }}>1 KDA = {reduceBalance(kdaValue)} $</CurrencyBalanceInfo>
                  <CurrencyBalanceInfo>{reduceBalance(auth.user.balance*kdaValue)} $</CurrencyBalanceInfo>
                </RowContainer> */}
            <ButtonContainer>
              <Button.Group fluid>
                <MyButton disabled buttonStyle={{ marginRight: "10px" }}>
                  Top up
                </MyButton>
                <MyButton
                  disabled={auth.user.balance === 0}
                  buttonStyle={{ marginLeft: "10px" }}
                  onClick={() => history.push(ROUTE_TRANSFER)}
                >
                  Transfer
                </MyButton>
              </Button.Group>
            </ButtonContainer>
          </FormContainer>
        </ContentContainer>

        {networkContext.network.name === "testnet" && !auth.loading && (
          <ButtonContainer>
            <a
              href="https://faucet.testnet.chainweb.com/"
              target="_blank"
              rel="noreferrer"
            >
              <MyButton>Go to Testnet Faucet</MyButton>
            </a>
          </ButtonContainer>
        )}
      </MainContainer>
    </>
  );
}

export default DashboardContainer;
