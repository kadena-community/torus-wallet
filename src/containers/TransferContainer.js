import React, { useContext } from "react";
import { Dimmer, Label, Loader, Form } from "semantic-ui-react";
import { Input as SUIInput } from "semantic-ui-react";
import styled from "styled-components/macro";
import * as Yup from "yup";
import { AuthContext } from "../contexts/AuthContext";

import Header from "../components/layout/header/Header";
import Button from "../components/shared/Button";
import swal from "sweetalert";
import { checkKey } from "../util/format-helpers";
import { PactContext } from "../contexts/PactContext";
import { useFormik } from "formik";
const ContentContainer = styled.div`
  width: 50%;
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
  & > div {
    margin-bottom: 24px;
  }
`;

const TransferContainer = () => {
  const auth = useContext(AuthContext);
  const pact = useContext(PactContext);

  const validationSchema = Yup.object().shape({
    toAccount: Yup.string().required("Insert Receiver account"),
    amount: Yup.number()
      .typeError("Amount must be a decimal number")
      .required("Insert amount"),
  });

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleBlur,
    handleChange,
    handleReset,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      toAccount: "",
      amount: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      auth.loginForTransfer().then((result) => {
        let pubKeyByNewLogAcct = pact.getPubFromPriv(result);

        if (pubKeyByNewLogAcct === auth.user.publicKey) {
          safeTransfer(
            "coin",
            auth.user.publicKey,
            result,
            values.toAccount,
            values.amount,
            "1"
          );
        } else {
          return swal(
            `CANNOT PROCESS TRANSFER:`,
            `The login account and confirmation account must be the same`
          );
        }
      });
      // from : a89643951920b8f272119d0e569c42e12e43bd36a956e33c2ef3876d99bae439
      // toAccount: 349c010fcbe76248d1111b804c4c9ffb83b525df6685c7eab2e7399cbbdcf5e6
    },
  });

  const safeTransfer = async (
    tokenAddress,
    fromAcct,
    fromAcctPrivKey,
    toAcct,
    amount,
    chainId
  ) => {
    pact.setTransferLoading(true);

    try {
      var fromDetails = await pact.getAcctDetails(
        tokenAddress,
        fromAcct,
        chainId
      );
      if (!fromDetails.account) {
        //not enough funds on fromAcct account on this chain
        pact.setTransferLoading(false);

        return swal(
          `CANNOT PROCESS TRANSFER: ${fromAcct} does not exist on chain ${chainId}`
        );
      }
      if (fromDetails.balance < amount) {
        //not enough funds on fromAcct account on this chain
        pact.setTransferLoading(false);

        return swal(
          `CANNOT PROCESS TRANSFER: not enough funds on chain ${chainId}`
        );
      }
      //check if toAcct exists on specified chain
      const details = await pact.getAcctDetails(tokenAddress, toAcct, chainId);
      if (details.account !== null) {
        //account exists on chain
        if (checkKey(toAcct) && toAcct !== details.guard.keys[0]) {
          //account is a public key account
          //but the public key guard does not match account name public key
          //EXIT function
          pact.setTransferLoading(false);

          return swal("CANNOT PROCESS TRANSFER: non-matching public keys");
        } else {
          //send to this account with this guard
          const res = await pact.transfer(
            tokenAddress,
            fromAcct,
            fromAcctPrivKey,
            toAcct,
            amount,
            chainId,
            details.guard
          );
          return res;
        }
      } else if (details === "CANNOT FETCH ACCOUNT: network error") {
        //account fetch failed
        //EXIT function
        pact.setTransferLoading(false);

        return swal("CANNOT PROCESS TRANSFER: account not fetched");
      } else {
        //toAcct does not yet exist
        if (checkKey(toAcct)) {
          //toAcct does not exist, but is a valid address

          // NOTE An exchange might want to ask the user to confirm that they
          // own the private key corresponding to this public key.

          //send to this
          const res = await pact.transfer(
            tokenAddress,
            fromAcct,
            fromAcctPrivKey,
            toAcct,
            amount,
            chainId,
            { pred: "keys-all", keys: [toAcct] }
          );
          handleReset();
          return res;
        } else {
          //toAcct is totally invalid
          //EXIT function
          pact.setTransferLoading(false);

          return swal("CANNOT PROCESS TRANSFER: new account not a public key");
        }
      }
    } catch (e) {
      //most likely a formatting or rate limiting error
      console.log(e);
      pact.setTransferLoading(false);

      return swal("CANNOT PROCESS TRANSFER: network error");
    }
  };

  return (
    <>
      {auth.loading && (
        <Dimmer active style={{ borderRadius: "16px" }}>
          <Loader content="Switching Network.." />
        </Dimmer>
      )}
      {pact.transferLoading && (
        <Dimmer active style={{ borderRadius: "16px" }}>
          <Loader content="Transfer in progress. It will take a few minutes.." />
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
              <Form>
                <Form.Field>
                  <SUIInput
                    name="toAccount"
                    id="toAccount"
                    label="Receiver"
                    placeholder="Insert Public Key"
                    size="big"
                    // disabled={disabled}
                    value={values.toAccount}
                    onChange={handleChange}
                    error={touched.toAccount && !!errors.toAccount}
                  ></SUIInput>
                  {touched.toAccount && !!errors.toAccount ? (
                    <Label basic color="red" pointing>
                      {touched.toAccount && errors.toAccount}
                    </Label>
                  ) : (
                    <></>
                  )}
                </Form.Field>
                <Form.Field>
                  <SUIInput
                    name="amount"
                    id="amount"
                    label="Amount"
                    placeholder="Insert Amount"
                    size="big"
                    // disabled={disabled}
                    value={values.amount}
                    onChange={handleChange}
                    error={touched.amount && !!errors.amount}
                  ></SUIInput>
                  {touched.amount && !!errors.amount ? (
                    <Label basic color="red" pointing>
                      {touched.amount && errors.amount}
                    </Label>
                  ) : (
                    <></>
                  )}
                </Form.Field>
                <Button onClick={handleSubmit}>Transfer</Button>
              </Form>
            </FormContainer>
          </KeyContainer>
        </ContentContainer>
      </MainContainer>
    </>
  );
};

export default TransferContainer;
