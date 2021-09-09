import React, { useContext } from "react";
import { Button, Dimmer, Loader } from "semantic-ui-react";
import { Input as SUIInput } from "semantic-ui-react";

import styled from "styled-components/macro";

import { AuthContext } from "../contexts/AuthContext";
import { NetworkContext } from "../contexts/NetworkContext";
import Header from "../components/layout/header/Header";

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
  margin-top: 50%;
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

const TransferContainer = () => {
  const auth = useContext(AuthContext);
  const networkContext = useContext(NetworkContext);

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
              <Title>Transfer</Title>
            </TitleContainer>
            <FormContainer
              style={{ color: "#FFFFFF", flexFlow: "column" }}
              id="tranfer"
            >
              <SUIInput
                label="Receiver"
                placeholder="Insert Public Key"
                // size={size}
                // disabled={disabled}
                // value={value}
                // error={error}

                onChange={(e, props) => {}}
                style={{
                  minWidth: "100px",
                  marginBottom: 24,
                }}
              ></SUIInput>
              <SUIInput
                label="Amount"
                placeholder="Insert Amount"
                // size={size}
                // disabled={disabled}
                // value={value}
                // error={error}

                onChange={(e, props) => {}}
                style={{ minWidth: "100px" }}
              ></SUIInput>
            </FormContainer>
          </KeyContainer>
        </ContentContainer>
      </MainContainer>
    </>
  );
};

export default TransferContainer;
