import React, { useEffect } from "react";
import { useContext, useState } from "react/cjs/react.development";
import { Dimmer, Grid, Loader } from "semantic-ui-react";
import styled from "styled-components";
import { AuthContext } from "../contexts/AuthContext";

import Header from "../components/layout/header/Header";
import { ChainwebContext, ChainweContext } from "../contexts/ChainwebContext";
import { PactContext } from "../contexts/PactContext";

const MainContainer = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  opacity: 1;
  width: 100%;
  height: auto;
`;
const Container = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
  height: auto;
`;

const ContentContainer = styled.div`
  position: relative;
  margin-top: 100px;
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
    margin-left: 10px;
    margin-right: 10px;
  }

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
  font: normal normal bold 32px/38px roboto-bold;
  letter-spacing: 0px;
  color: #ffffff;
  text-transform: capitalize;
`;

const HistoryContainer = () => {
  const auth = useContext(AuthContext);
  const chainwebContext = useContext(ChainwebContext);
  const pact = useContext(PactContext);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    if (auth?.user?.publicKey) {
      chainwebContext.setChainEvents([]);
      chainwebContext.getEvents();
    }
  }, [pact.transferLoading, auth.loading]);

  //   useEffect(() => {
  //     if (auth?.user?.publicKey && chainwebContext.chainEvents.length < 20) {
  //       setHistoryLoading(true);
  //     } else {
  //       setHistoryLoading(false);
  //     }
  //   }, [chainwebContext.chainEvents.length]);
  return (
    <>
      {auth.loading && (
        <Dimmer active style={{ borderRadius: "16px" }}>
          <Loader content="Switching Network.." />
        </Dimmer>
      )}
      {/* {historyLoading && (
        <Dimmer active style={{ borderRadius: "16px" }}>
          <Loader
            content={`Updating history wallet transfer - chain: ${chainwebContext.chainEvents.length}`}
          />
        </Dimmer>
      )} */}
      <MainContainer>
        <Header />
        <Container>
          <ContentContainer>
            <TitleContainer>
              <Title>History Wallet</Title>
            </TitleContainer>
            <Grid style={{ marginBottom: 10, width: "100%" }}>
              <Grid.Row columns="3">
                <Grid.Column>Chain</Grid.Column>
                <Grid.Column>to Account</Grid.Column>
                <Grid.Column>Amount</Grid.Column>
              </Grid.Row>
            </Grid>
            <PartialScrollableScrollSection>
              <Grid style={{ width: "100%", minHeight: "50px" }}>
                {/* {chainwebContext.chainEvents.length === 20
                  ? chainwebContext?.chainEvents?.map((obj, index) => {
                      if (obj?.length > 0) {
                        return obj?.forEach((chain) => (
                          <Grid.Row columns="3" key={index}>
                            <Grid.Column>{index}</Grid.Column>
                            <Grid.Column>{chain?.height}</Grid.Column>
                            <Grid.Column>{`${chain?.params[2]} KDA`}</Grid.Column>
                          </Grid.Row>
                        ));
                      }
                    })
                  : null} */}
                <Grid.Row columns="3">
                  <Grid.Column>0</Grid.Column>
                  <Grid.Column>....vnd848vn40f4</Grid.Column>
                  <Grid.Column>2 KDA</Grid.Column>
                </Grid.Row>
                <Grid.Row columns="3">
                  <Grid.Column>2</Grid.Column>
                  <Grid.Column>....vnd848vn40f4</Grid.Column>
                  <Grid.Column>5 KDA</Grid.Column>
                </Grid.Row>
                <Grid.Row columns="3">
                  <Grid.Column>1</Grid.Column>
                  <Grid.Column>....vnd848vn40f4</Grid.Column>
                  <Grid.Column>1.12 KDA</Grid.Column>
                </Grid.Row>
                <Grid.Row columns="3">
                  <Grid.Column>5</Grid.Column>
                  <Grid.Column>....vnd848vn40f4</Grid.Column>
                  <Grid.Column>221.4 KDA</Grid.Column>
                </Grid.Row>
              </Grid>
            </PartialScrollableScrollSection>
          </ContentContainer>
        </Container>
      </MainContainer>
    </>
  );
};

export default HistoryContainer;
