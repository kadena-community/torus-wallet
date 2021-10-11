/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useContext } from "react/cjs/react.development";
import { Divider, Dropdown, Grid } from "semantic-ui-react";
import styled from "styled-components";
import Pact from "pact-lang-api";

import { AuthContext } from "../contexts/AuthContext";

import { PactContext } from "../contexts/PactContext";
import { chainList } from "../constants/chainList";
import { reduceTokenMobile } from "../util/reduceToken";
import { NetworkContext } from "../contexts/NetworkContext";
import Layout from "../components/layout/Layout";
import theme from "../styles/theme";

const ContentContainer = styled.div`
  position: relative;
  max-height: 70vh;
  max-width: 650px;
  display: flex;
  flex-flow: column;
  width: 100%;
  padding:10px;
 
  color: ${({ theme: { colors } }) => colors.white};
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
          width:90%;
    margin-top: 10%;
  }

  ::-webkit-scrollbar {
    display: block;
  }

  .textBold {
    font-family: ${({theme:{fontFamily}})=>fontFamily.bold};
    @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
        font-size: 12px;
          padding:0 0 0 10px !important;
    }
  }

  .item-column {
    font-family: ${({theme:{fontFamily}})=>fontFamily.regular};
    @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
            font-size: 12px;
            padding:0 0 0 10px !important;
    }  
  }
`;

const ListContainer = styled.div`
position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  padding: 20px 20px;
  border-radius: 24px;
  box-shadow: ${theme.boxshadowLogin};
  background: ${theme.backgroundGradient};
  opacity: 1;
  ::-webkit-scrollbar {
    display: block;
  }
`;

export const PartialScrollableScrollSection = styled.div`
  flex: 1;
  overflow: auto;
  max-height: 80vh;
  margin-bottom: -10px;

  ::-webkit-scrollbar {
    display: block;
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
  font: ${({ theme: { macroFont } }) => macroFont.highBold};
  letter-spacing: 0px;
  color: #ffffff;
  text-transform: capitalize;
`;

const HistoryContainer = () => {
  const auth = useContext(AuthContext);
  const pact = useContext(PactContext);
  const { network } = useContext(NetworkContext);

  const [selectedChain, setSelectedChain] = useState(0);

  useEffect(() => {
    getTransferList(selectedChain);
  }, [selectedChain, pact.confirmResponseTransfer]);

  const getTransferList = async (chainId) => {
    pact.setTxList({});
    var reqKeyList = JSON.parse(localStorage.getItem("reqKeys"));
    if (reqKeyList) {
      let tx = await Pact.fetch.poll(
        { requestKeys: Object.values(reqKeyList) },
        pact.host(`${chainId}`)
      );
      if (Object.keys(tx).length !== 0) {
        const search = Object.values(tx).some(
          (t) => t?.events[1]?.params[0] === auth?.user?.publicKey
        );

        if (search) pact.setTxList(tx);
        else pact.setTxList("NO_TX_FOUND");
      } else pact.setTxList("NO_TX_FOUND");
    } else pact.setTxList("NO_TX_FOUND");
  };

  return (
    <Layout>

      <ContentContainer>
      <TitleContainer>
          <Title>History Wallet</Title>
        </TitleContainer>
        <ListContainer>
        <Dropdown
          style={{
            fontSize: 18,
            minWidth: "2.5em",
            marginBottom: 16,
            border: "2px solid #ffffff",
          }}
          selection
          value={selectedChain}
          placeholder="Chain"
          options={
            !auth.loading &&
            Object.values(chainList).map((chain) => ({
              key: chain,
              text: `Chain ${chain}`,
              value: chain,
            }))
          }
          onChange={(e, value) => {
            setSelectedChain(value.value);
          }}
        />
        <Grid style={{ width: "100%", margin: "2px 0 16px 0"} }>
          <Grid.Row columns="3" style={{padding:0}}>
            <Grid.Column className="textBold" >Tx ID</Grid.Column>
            <Grid.Column className="textBold" >To Account</Grid.Column>
            <Grid.Column className="textBold" >Amount</Grid.Column>
          </Grid.Row>
        </Grid>
        <Divider style={{display: "flex",margin:0, width: "100%",  borderTop: "1px solid #fff"}}/>
        <PartialScrollableScrollSection>
          <Grid style={{ width: "100%", minHeight: "50px", margin: "8px 0" }}>
            {pact.txList === "NO_TX_FOUND" ? (
              <Grid.Row>
                <Grid.Column>No Transfer found</Grid.Column>
              </Grid.Row>
            ) : (
              Object.values(pact.txList)
                .sort((a, b) => a?.txId - b?.txId)
                .filter(
                  (tx) => tx?.events[1]?.params[0] === auth.user?.publicKey
                )
                .map((tx, index) => (
                  <Grid.Row
                    columns="3"
                    key={index}
                    style={{ cursor: "pointer"}}
                    onClick={() => {
                      window.open(
                        `https://explorer.chainweb.com/${network.name}/tx/${tx?.reqKey}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    <Grid.Column className="item-column" >{tx?.txId}</Grid.Column>
                    <Grid.Column className="item-column">
                      {reduceTokenMobile(tx?.events[1]?.params[1])}
                    </Grid.Column>
                    <Grid.Column className="item-column" >{`${tx?.events[1]?.params[2]} KDA`}</Grid.Column>
                  </Grid.Row>
                ))
            )}
          </Grid>
        </PartialScrollableScrollSection>
        </ListContainer>
      </ContentContainer>
    </Layout>
  );
};

export default HistoryContainer;
