import React, { useContext, useState } from 'react';
import { Button, Message, Popup } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';

import MyButton from '../components/shared/Button';
import { reduceBalance } from '../util/reduceBalance';
import { reduceToken } from '../util/reduceToken';
import { AuthContext } from '../contexts/AuthContext';
import { NetworkContext } from '../contexts/NetworkContext';
import { ROUTE_TRANSFER } from '../router/routes';
import Layout from '../components/layout/Layout';
import { CopyIcon, DropdownIcon, KadenaBlueIcon } from '../assets';
import theme from '../styles/theme';
import { PactContext } from '../contexts/PactContext';

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

const ContentContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-flow: column;
  align: center;
  justify-content: center;
  max-height: 70vh;
`;

const KeyContainer = styled.div`
  margin-top: 5%;
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
    margin-top: 10%;
    margin-bottom: 16px;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel + 1}px`}) {
    margin-top: 0px;
    margin-bottom: 16px;
  }
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
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    margin-bottom: 0px;
  }
`;

const Title = styled.span`
  font: ${({ theme: { macroFont } }) => macroFont.highBold};
  letter-spacing: 0px;
  color: ${({ theme: { colors } }) => colors.white};
  text-transform: capitalize;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    font-size: 24px;
  }
`;

const SubTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row;
  margin: 10px 0px;
  width: 100%;
`;

const SubTitle = styled.span`
  font: ${({ theme: { macroFont } }) => macroFont.smallBold};
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
  font: ${({ theme: { macroFont } }) => macroFont.tinyBold};
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
  font: ${({ theme: { macroFont } }) => macroFont.highBold};
  letter-spacing: 0px;
  color: ${({ theme: { colors } }) => colors.white};
  text-transform: capitalize;
  opacity: 1;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    font-size: 24px;
  }
`;

const CurrencyBalance = styled.span`
  font: ${({ theme: { macroFont } }) => macroFont.highBold};
  letter-spacing: 0px;
  color: ${({ theme: { colors } }) => colors.white};
  opacity: 1;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    font-size: 24px;
  }
`;
const CurrencyBalanceTokenName = styled.span`
  font: ${({ theme: { macroFont } }) => macroFont.highBold};
  letter-spacing: 0px;
  color: ${({ theme: { colors } }) => colors.white};
  opacity: 1;
  margin-left: 5px;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    font-size: 24px;
  }
`;

const FormContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
  /* gap: 32px; */
  padding: 20px 20px;
  border-radius: 24px;
  box-shadow: ${theme.boxshadowLogin};
  align-items: center;
  justify-content: center;
  opacity: 1;
  background: ${theme.backgroundGradient};
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
  const pact = useContext(PactContext);

  const [errorOnPrivKey, setErrorOnPrivKey] = useState(false);
  const [privKey, setPrivKey] = useState();

  return (
    <Layout>
      <ContentContainer>
        <KeyContainer>
          <TitleContainer style={{ marginTop: '20px' }}>
            <Title>Your Public Key:</Title>
          </TitleContainer>
          <FormContainer
            style={{ color: theme.colors.white, flexFlow: 'row' }}
            id='pubKey'
          >
            <div className='mobile-none'>{auth.user.publicKey}</div>
            <div className='desktop-none'>
              {reduceToken(auth.user.publicKey)}
            </div>
            <Popup
              content='copied!'
              on='click'
              position='bottom right'
              style={{ opacity: 0.7 }}
              pinned
              trigger={
                <CopyIcon
                  style={{ marginLeft: '35px' }}
                  onClick={() => {
                    navigator.clipboard.writeText(auth.user.publicKey);
                  }}
                />
              }
            />
          </FormContainer>

          {!privKey && (
            <ButtonContainer>
              <MyButton
                onClick={() => {
                  auth.loginForTransfer().then((result) => {
                    if (result) {
                      let pubKeyByNewLogAcct = pact.getPubFromPriv(result);
                      if (pubKeyByNewLogAcct === auth.user.publicKey) {
                        setErrorOnPrivKey(false);
                        setPrivKey(result);
                      } else {
                        setErrorOnPrivKey(true);
                      }
                    }
                  });
                }}
              >
                Export Private Key
              </MyButton>
            </ButtonContainer>
          )}

          {errorOnPrivKey && (
            <TitleContainer
              style={{
                color: 'red',
                alignItems: 'center',
                marginTop: '10px',
                fontSize: '18px',
              }}
            >
              The login account and confirmation account must be the same,
              please try again.
            </TitleContainer>
          )}

          {privKey && (
            <>
              <TitleContainer style={{ marginTop: '15px' }}>
                <Title>Your Private Key:</Title>
              </TitleContainer>
              <FormContainer
                style={{ color: '#FFFFFF', flexFlow: 'row' }}
                id='privKey'
              >
                <div className='mobile-none'>{privKey}</div>
                <div className='desktop-none'>{reduceToken(privKey)}</div>
                <Popup
                  className='mobile-none'
                  content='copied!'
                  on='click'
                  position='bottom right'
                  style={{ opacity: 0.7 }}
                  pinned
                  trigger={
                    <CopyIcon
                      style={{ marginLeft: '35px' }}
                      onClick={() => {
                        navigator.clipboard.writeText(privKey);
                      }}
                    />
                  }
                />
              </FormContainer>
            </>
          )}
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
                      style={{ marginLeft: '10px', marginBottom: '4px' }}
                    />
                  </SubTitle>
                }
                on='click'
                offset={[0, 1]}
                position='bottom left'
                style={{
                  height: '196px',
                  overflow: 'auto',
                  background:
                    'transparent radial-gradient(closest-side at 31% -64%, #201669 0%, #251C72 31%, #0F054C 100%) 0% 0% no-repeat padding-box',
                  boxShadow: '0px 4px 56px #8383833D',
                  border: '1px solid #110750',
                  borderRadius: '10px',
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
              </Popup>

              <SubTitle className='mobile-none'>
                {auth.user.balance.reduce((a, b) => {
                  return parseFloat(a) + parseFloat(b);
                })}{' '}
                KDA
              </SubTitle>
              <SubTitle className='desktop-none'>
                {reduceBalance(
                  auth.user.balance.reduce((a, b) => {
                    return parseFloat(a) + parseFloat(b);
                  })
                )}{' '}
                KDA
              </SubTitle>
            </SubTitleContainer>
          )}
        </TitleContainer>
        <FormContainer style={{ color: '#FFFFFF' }}>
          <RowContainer>
            <BalanceCurrencyTitle>
              <KadenaBlueIcon style={{ marginRight: '10px' }} />
              kadena
            </BalanceCurrencyTitle>
            <CurrencyBalance className='mobile-none'>
              {auth.user.balance.reduce((a, b) => {
                return parseFloat(a) + parseFloat(b);
              })}
              <CurrencyBalanceTokenName>KDA</CurrencyBalanceTokenName>
            </CurrencyBalance>
            <CurrencyBalance className='desktop-none'>
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
              <MyButton disabled buttonStyle={{ marginRight: '10px' }}>
                Top up
              </MyButton>
              <MyButton
                disabled
                buttonStyle={{ marginLeft: '10px' }}
                onClick={() => history.push(ROUTE_TRANSFER)}
              >
                Transfer
              </MyButton>
            </Button.Group>
          </ButtonContainer>
        </FormContainer>
        {networkContext.network.name === 'testnet' && !auth.loading && (
          <ButtonContainer>
            <a
              href='https://faucet.testnet.chainweb.com/'
              target='_blank'
              rel='noreferrer'
            >
              <MyButton>Go to Testnet Faucet</MyButton>
            </a>
          </ButtonContainer>
        )}
      </ContentContainer>
    </Layout>
  );
}

export default DashboardContainer;
