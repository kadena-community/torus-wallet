/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { Input as SUIInput } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import * as Yup from 'yup';
import Pact from 'pact-lang-api';
import { useFormik } from 'formik';
import swal from 'sweetalert';
import { AuthContext } from '../contexts/AuthContext';
import { PactContext } from '../contexts/PactContext';

import Button from '../components/shared/Button';
import InputWithLabel from '../components/shared/InputWithLabel';

import {
  checkKAccount,
  checkKey,
  extractPubKeyFromKAccount,
} from '../util/format-helpers';
import { accountBalance, reduceBalance } from '../util/reduceBalance';
import { chainList } from '../constants/chainList';
import Layout from '../components/layout/Layout';
import theme from '../styles/theme';
import CustomLoader from '../components/shared/CustomLoader';

const ContentContainer = styled.div`
  position: relative;
  max-height: 90vh;
  max-width: 900px;
  display: flex;
  flex-flow: column;
  padding: 10px 10px;
  width: 100%;

  ::-webkit-scrollbar {
    display: block;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel + 1}px`}) {
    width: 90%;
  }

  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    width: 90%;
    margin-top: 10px;
  }
`;

const KeyContainer = styled.div`
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
  }
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: row;
  margin-bottom: 10px;
  width: 100%;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    flex-flow: column;
  }
`;

const Title = styled.span`
  font: ${({ theme: { macroFont } }) => macroFont.highBold};
  letter-spacing: 0px;
  color: ${({ theme: { colors } }) => colors.white};
  text-transform: capitalize;
`;

const FormContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 100%;
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
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel + 1}px`}) {
    & > div {
      margin-bottom: 12px !important;
    }
  }

  & > div {
    margin-bottom: 24px;
  }
  ::-webkit-scrollbar {
    display: block;
  }
`;

const TransferContainer = () => {
  const auth = useContext(AuthContext);
  const pact = useContext(PactContext);

  useEffect(() => {
    handleReset();
  }, [pact.confirmResponseTransfer]);

  const validationSchema = Yup.object().shape({
    toAccount: Yup.string()
      .required('Insert Receiver account')
      .min(3, 'Receiver must be at least 3 characters'),
    amount: Yup.number()
      .typeError('Amount must be a decimal number')
      .required('Insert amount')
      .max(
        reduceBalance(
          auth.user.balance.reduce((a, b) => {
            return parseFloat(a) + parseFloat(b);
          })
        ),
        'The amount must be less or ugual to balance'
      ),
    senderChain: Yup.string().required('Select Sender Chain'),
    receiverChain: Yup.string().required('Select Receiver Chain'),
  });

  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleReset,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      toAccount: '',
      amount: '',
      senderChain: 'ANY',
      receiverChain: 0,
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      auth
        .loginForTransfer()
        .then((result) => {
          let pubKeyByNewLogAcct = pact.getPubFromPriv(result);
          // if (pubKeyByNewLogAcct === values.toAccount) {
          //   pact.transferCrossChainSameAccount(
          //     'coin',
          //     auth.user.publicKey,
          //     result,
          //     values.amount,
          //     values.senderChain,
          //     `${values.receiverChain}`
          //   );
          // } else
          if (values.senderChain !== 'ANY') {
            if (
              pubKeyByNewLogAcct === auth.user.publicKey &&
              values.senderChain === values.receiverChain
            ) {
              safeTransfer(
                'coin',
                auth.user.publicKey,
                result,
                values.toAccount,
                values.amount,
                `${values.receiverChain}`
              );
            } else {
              return swal(
                `CANNOT PROCESS TRANSFER:`,
                `The login account and confirmation account must be the same`,
                {
                  icon: 'error',
                }
              );
            }
          } else {
            safeTransferCrossChain(
              'coin',
              auth.user.publicKey,
              result,
              values.toAccount,
              values.amount,
              `${values.receiverChain}`
            );
          }
        })
        .catch((e) => console.log(e));
    },
  });

  useEffect(() => {
    if (values.senderChain !== 'ANY')
      setFieldValue('receiverChain', values.senderChain);
  }, [values.senderChain]);

  const safeTransfer = async (
    tokenAddress,
    fromAcct,
    fromAcctPrivKey,
    toAcct,
    amount,
    chainId
  ) => {
    try {
      var fromDetails = await pact.getAcctDetails(
        tokenAddress,
        fromAcct,
        chainId
      );
      if (!fromDetails.account) {
        //not enough funds on fromAcct account on this chain

        return swal(
          `CANNOT PROCESS TRANSFER: ${fromAcct} does not exist on chain ${chainId}`,
          {
            icon: 'error',
          }
        );
      }
      if (fromDetails.balance < amount) {
        //not enough funds on fromAcct account on this chain

        return swal(
          `CANNOT PROCESS TRANSFER: not enough funds on chain ${chainId}`,
          {
            icon: 'error',
          }
        );
      }
      if (!checkKAccount(toAcct)) {
        //destination address not a k-style account
        return swal(
          `CANNOT PROCESS TRANSFER: destination account not k-style: ${toAcct}`,
          {
            icon: 'error',
          }
        );
      }
      //check if toAcct exists on specified chain
      const details = await pact.getAcctDetails(tokenAddress, toAcct, chainId);
      if (details.account !== null) {
        //k-account exists on chain
        //send to this account with its already existing guard
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
      } else if (details === 'CANNOT FETCH ACCOUNT: network error') {
        //account fetch failed
        //EXIT function
        return swal(`CANNOT PROCESS TRANSFER: account not fetched`, {
          icon: 'error',
        });
      } else {
        //toAcct does not yet exist, but is k-style account name
        // NOTE An exchange might want to ask the user to confirm that they
        // own the private key corresponding to this public key.
        const pubKey = extractPubKeyFromKAccount(toAcct);
        if (!pubKey) {
          // Extraction failed; In theory this shouldnt happen since we already checked the
          // k-account is valid, but better to check just in case
          return swal(
            'CANNOT PROCESS TRANSFER: public key not extracted from address',
            {
              icon: 'error',
            }
          );
        }
        //send to this
        const res = await pact.transfer(
          tokenAddress,
          fromAcct,
          fromAcctPrivKey,
          toAcct,
          amount,
          chainId,
          { pred: 'keys-all', keys: [pubKey] }
        );
        return res;
      }
    } catch (e) {
      //most likely a formatting or rate limiting error
      console.log(e);

      return swal('CANNOT PROCESS TRANSFER: network error', {
        icon: 'error',
      });
    }
  };

  const safeTransferCrossChain = async (
    tokenAddress,
    fromAcct,
    fromAcctPrivKey,
    toAcct,
    amount,
    targetChainId
  ) => {
    // OR add A Notification!
    try {
      var ownDetails = await pact.getAcctDetails(
        tokenAddress,
        fromAcct,
        targetChainId
      );
      if (ownDetails.balance < amount) {
        //not enough funds on PUB_KEY account on this chain
        //wait for funds to be transferred from own account on other chains
        const fundedXChain = await pact.balanceFunds(
          tokenAddress,
          fromAcct,
          fromAcctPrivKey,
          amount,
          ownDetails.balance,
          targetChainId
        );
        if (fundedXChain !== 'BALANCE FUNDS SUCCESS') {
          //was not able to move funds across different chains

          return swal(
            `CANNOT PROCESS TRANSFER:`,
            `Not enough funds on chain ${targetChainId}`,
            {
              icon: 'error',
            }
          );
        }
      }
      //check if toAcct exists on specified chain
      const details = await pact.getAcctDetails(
        tokenAddress,
        toAcct,
        targetChainId
      );

      if (details.account !== null) {
        //account exists on chain
        if (checkKey(toAcct) && toAcct !== details.guard.keys[0]) {
          //account is a public key account
          //but the public key guard does not match account name public key
          //EXIT function

          return swal('CANNOT PROCESS TRANSFER:', 'Non-matching public keys', {
            icon: 'error',
          });
        } else {
          //send to this account with this guard
          const res = await pact.transfer(
            tokenAddress,
            fromAcct,
            fromAcctPrivKey,
            toAcct,
            amount,
            targetChainId,
            details.guard
          );
          return res;
        }
      } else if (details === 'CANNOT FETCH ACCOUNT: network error') {
        //account fetch failed
        //EXIT function

        return swal('CANNOT PROCESS TRANSFER:', 'Account not fetched', {
          icon: 'error',
        });
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
            targetChainId,
            { pred: 'keys-all', keys: [toAcct] }
          );
          return res;
        } else {
          //toAcct is totally invalid
          //EXIT function

          return swal(
            'CANNOT PROCESS TRANSFER:',
            'New account not a public key'
          );
        }
      }
    } catch (e) {
      //most likely a formatting or rate limiting error

      console.log(e);
      return swal('CANNOT PROCESS TRANSFER:', 'Network error', {
        icon: 'error',
      });
    }
  };

  const getSenderChainOptions = () => {
    if (!auth.loading) {
      const optUser = auth.user.balance.map((bal, index) => ({
        key: index,
        text: `Chain ${index} - ${reduceBalance(bal)} KDA`,
        value: index,
      }));
      optUser.unshift({
        key: 'any',
        text: `Any Chain - ${accountBalance(auth.user.balance)}  KDA`,
        value: 'ANY',
      });
      return optUser;
    }
  };

  return (
    <Layout
      loader={[
        <CustomLoader loader={auth.connectingLoading} message='Connecting..' />,
      ]}
    >
      <ContentContainer>
        <KeyContainer>
          <TitleContainer>
            <Title>Transfer</Title>
            <Button
              type='submit'
              fontSize='20px'
              disabled={values.amount > accountBalance(auth.user.balance)}
              onClick={() => {
                auth.loginForTransfer().then((result) => {
                  let pubKeyByNewLogAcct = pact.getPubFromPriv(result);
                  // ADD CONTROL THAT CONFIRMATION ACCOUNT IS LOGIN ACCOUNT

                  // TO MAKE AN ACCOUNT A K:ACCOUNT, MUST HAVE AT LEAST 0.00000001 KDA ON ALL CHAIN
                  // THE SOFTWARE NEED TO HAVE A FUNCTION THAT DIVIDE THE AMOUNT BETWEEN THE CHAINS

                  if (auth.isNotKAccount) {
                    pact.transferCrossChainSameAccountForCreationKAccount(
                      'coin',
                      pubKeyByNewLogAcct,
                      result,
                      auth.user.balance
                    );
                    // const keyPairs = [];
                    // // Each of these accounts can be used with the correspondingly indexed keypair
                    // const kAccounts = [];

                    // //change from 100 to any number of keys you would like to create
                    // for (let i = 0; i < 100; i++) {
                    //   const kp = Pact.crypto.genKeyPair();
                    //   kAccounts.push('k:' + kp.publicKey);
                    //   keyPairs.push(kp);
                    // }
                    // pact.createAddresses(
                    //   'coin',
                    //   [kAccounts],
                    //   pubKeyByNewLogAcct,
                    //   result
                    // );
                  }
                });
              }}
            >
              Make the Account a K:Account
            </Button>
          </TitleContainer>
          <FormContainer
            style={{ color: '#FFFFFF', flexFlow: 'column' }}
            id='tranfer'
          >
            <InputWithLabel
              label='Sender Chain'
              error={touched.senderChain && errors.senderChain}
            >
              <Dropdown
                fluid
                selection
                name='senderChain'
                id='senderChain'
                placeholder='Chain'
                className='sender-dropdown'
                options={getSenderChainOptions()}
                onChange={(e, value) => {
                  setFieldValue('senderChain', value.value);
                }}
                value={values.senderChain}
              />
            </InputWithLabel>
            <InputWithLabel
              label='Receiver'
              error={touched.toAccount && errors.toAccount}
            >
              <SUIInput
                fluid
                name='toAccount'
                id='toAccount'
                label={
                  <Dropdown
                    className='receiver-dropdown'
                    style={{ borderLeft: 'none !important' }}
                    selection
                    name='receiverChain'
                    id='receiverChain'
                    placeholder='Chain'
                    options={
                      !auth.loading &&
                      Object.values(chainList).map((chain) => ({
                        key: chain,
                        text: `Chain ${chain}`,
                        value: chain,
                      }))
                    }
                    disabled={
                      // auth.user.publicKey === values.toAccount
                      //   ? false
                      //   :
                      values.senderChain !== 'ANY'
                    }
                    onChange={(e, value) => {
                      setFieldValue('receiverChain', value.value);
                    }}
                    value={values.receiverChain}
                  />
                }
                labelPosition='right'
                placeholder='Insert Public Key'
                size='big'
                // disabled={disabled}
                value={values.toAccount}
                onChange={handleChange}
                error={touched.toAccount && !!errors.toAccount}
              ></SUIInput>
            </InputWithLabel>
            <InputWithLabel
              label='Amount'
              error={touched.amount && errors.amount}
            >
              <SUIInput
                fluid
                name='amount'
                id='amount'
                placeholder='Insert Amount'
                size='big'
                // disabled={disabled}
                value={values.amount}
                onChange={handleChange}
                error={touched.amount && !!errors.amount}
              ></SUIInput>
            </InputWithLabel>
            <Button
              type='submit'
              buttonStyle={{ width: '100%' }}
              fontSize='20px'
              inverted={values.amount <= accountBalance(auth.user.balance)}
              disabled={values.amount > accountBalance(auth.user.balance)}
              onClick={handleSubmit}
            >
              Transfer
            </Button>
          </FormContainer>
        </KeyContainer>
      </ContentContainer>
    </Layout>
  );
};

export default TransferContainer;
