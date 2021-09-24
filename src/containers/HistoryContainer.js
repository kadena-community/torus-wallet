/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useContext } from "react/cjs/react.development";
import { Dropdown, Grid } from "semantic-ui-react";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";

import { PactContext } from "../contexts/PactContext";
import { chainList } from "../constants/chainList";
import { reduceTokenMobile } from "../util/reduceToken";
import { NetworkContext } from "../contexts/NetworkContext";
import Layout from "../components/layout/Layout";

const ContentContainer = styled.div`
  position: relative;
  margin-top: 50px;
  max-height: 70vh;
  max-width: 650px;
  display: flex;
  flex-flow: column;
  padding: 20px 20px;
  width: 100%;
  border-radius: 24px;
  box-shadow: 0px 4px 56px #8383833d;
  background: transparent
    radial-gradient(
      closest-side at 31% -64%,
      #2b237c 0%,
      #251c72 31%,
      #0f054c 100%
    )
    0% 0% no-repeat padding-box;
  opacity: 1;
  color: #ffffff;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    margin-top: 10%;
    margin-left: 10px;
    margin-right: 10px;
  }

  ::-webkit-scrollbar {
    display: block;
  }

  .textBold {
    font-family: roboto-bold;
    font-size: 18px;
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
  font: normal normal bold 32px/38px roboto-bold;
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
    pact.getTransferList(selectedChain);
  }, [selectedChain]);

  return (
    <Layout>
      <ContentContainer>
        <TitleContainer>
          <Title>History Wallet</Title>
        </TitleContainer>
        <Dropdown
          style={{
            fontFamily: "roboto-bold",
            fontSize: 18,
            minWidth: "2.5em",
            marginBottom: 16,
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
        <Grid style={{ width: "100%", marginLeft: 0 }}>
          <Grid.Row columns="3">
            <Grid.Column className="textBold">Tx Id</Grid.Column>
            <Grid.Column className="textBold">to Account</Grid.Column>
            <Grid.Column className="textBold">Amount</Grid.Column>
          </Grid.Row>
        </Grid>
        <PartialScrollableScrollSection>
          <Grid style={{ width: "100%", minHeight: "50px", margin: "16px 0" }}>
            {pact.txList === "NO_TX_FOUND" ? (
              <Grid.Row>
                <Grid.Column>No Transfer found</Grid.Column>
              </Grid.Row>
            ) : (
              Object.values(pact.txList).map((tx, index) => (
                <Grid.Row
                  columns="3"
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.open(
                      `https://explorer.chainweb.com/${network.name}/tx/${tx?.reqKey}`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                >
                  <Grid.Column>{tx?.txId}</Grid.Column>
                  <Grid.Column>
                    {reduceTokenMobile(tx?.events[1]?.params[1])}
                  </Grid.Column>
                  <Grid.Column>{`${tx?.events[1]?.params[2]} KDA`}</Grid.Column>
                </Grid.Row>
              ))
            )}
          </Grid>
        </PartialScrollableScrollSection>
      </ContentContainer>
    </Layout>
  );
};

export default HistoryContainer;
