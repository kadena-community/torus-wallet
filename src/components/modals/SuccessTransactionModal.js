import React, { useState } from "react";
import styled from "styled-components/macro";
import { SuccessfullIcon } from "../../assets";
import ModalContainer from "../shared/ModalContainer";
import Button from "../shared/Button";
import { reduceTokenMobile } from "../../util/reduceToken";

const Container = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  min-width: 385px;
  width: 100%;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.div`
  font: ${({ theme: { macroFont } }) => macroFont.smallBold};
  color: ${({ theme: { colors } }) => colors.white};
`;

const TransactionsDetails = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 0px;
  padding-top: 5px;
  & > *:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const SpaceBetweenRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Label = styled.span`
  font: ${({ theme: { macroFont } }) => macroFont.tinyBold};
  color: ${({ theme: { colors } }) => colors.white};
`;

const Value = styled.span`
  font-family: ${({ theme: { fontFamily } }) => fontFamily.regular};
  font-size: 16px;
  color: ${({ theme: { colors } }) => colors.white};
`;

const SuccessTransactionModal = ({
  fromAccount,
  toAccount,
  amount,
  senderChainId,
  receiverChainId,
  onClose,
}) => {
  return (
    <Container>
      <ModalContainer
        title="Transfer Success!"
        containerStyle={{
          height: "100%",
          maxHeight: "80vh",
          maxWidth: "90vw",
        }}
      >
        <Content>
          <SuccessfullIcon />
          <Title style={{ padding: "16px 0px" }}>Transaction Details</Title>
          <TransactionsDetails>
            <SpaceBetweenRow>
              <Label>{`From Account`}</Label>
              <Value>{`${reduceTokenMobile(fromAccount)}`}</Value>
            </SpaceBetweenRow>
            <SpaceBetweenRow>
              <Label>{`toAccount`}</Label>
              <Value>{`${reduceTokenMobile(toAccount)}`}</Value>
            </SpaceBetweenRow>
            <SpaceBetweenRow>
              <Label>{`Amount`}</Label>
              <Value>{`${amount} KDA`}</Value>
            </SpaceBetweenRow>
            <SpaceBetweenRow>
              <Label>{`Sender Chain`}</Label>
              <Value>{`${senderChainId}`}</Value>
            </SpaceBetweenRow>
            <SpaceBetweenRow>
              <Label>{`Receiver Chain`}</Label>
              <Value>{`${receiverChainId}`}</Value>
            </SpaceBetweenRow>
          </TransactionsDetails>
          <Button
            buttonStyle={{ width: "100%" }}
            onClick={() => {
              onClose();
            }}
          >
            Confirm
          </Button>
        </Content>
      </ModalContainer>
    </Container>
  );
};

export default SuccessTransactionModal;
