import React, { useContext } from "react";
import { Button, Loader, Dimmer } from "semantic-ui-react";
import styled from "styled-components/macro";
import { GoogleIcon, KadenaTorusIcon } from "../assets";
import { AuthContext } from "../contexts/AuthContext";
import { ViewportContext } from "../contexts/ViewportContext";
import theme from "../styles/theme";

const HomeContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row;
  textAlign: center;
  /* margin: 72px 64px; */
  height: 100%;
  padding: 10px 10px;
  border-radius: 24px;
  border: 24px;
  box-shadow:${theme.boxshadowLogin};
  align-items: center;
  justify-content: center;
  opacity: 1;
  background: ${theme.backgroundGradient}
  @media (max-width: ${({ theme: { mediaQueries } }) =>
    `${mediaQueries.mobilePixel + 1}px`}) {
    /* margin: 30px 18px 18px; */
    padding 0px;
    flex-flow: column;
  }
`;

const HomeTopContainer = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: left;
  align-items: flex-start;
  padding: 10px 20px 0px;
  width: 75%;
  background: transparent;
  opacity: 1;
`;

const HomeLeftContainer = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 40px 10px;
  height: 100%;
  width: 50%;
  background: transparent;
  opacity: 1;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    width: 0%;
    height: 0%;
    padding: 0px;
  }
`;

const HomeRightContainer = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 50%;
  background: ${theme.colors.white} 0% 0% no-repeat padding-box;
  border-radius: 16px;
  opacity: 1;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    width: 100%;
    padding: 0px;
  }
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobileSmallPixel + 1}px`}) {
    padding: 16px;
  }
`;

const HomeRightContent = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: left;
  align-items: left;
`;

const HomeTitle = styled.span`
  font: ${({ theme: { macroFont } }) => macroFont.highBold};
  text-align: left;
  letter-spacing: 0px;
  color: ${({ theme: { colors } }) => colors.black}
  text-transform: capitalize;
  opacity: 1;
  margin-bottom: 25px;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
    `${mediaQueries.mobileSmallPixel + 1}px`}) {
    font:${({ theme: { macroFont } }) => macroFont.mediumBold};
  }
`;

const HomeSubTitle = styled.span`
  font: ${({ theme: { macroFont } }) => macroFont.mediumRegular};
  text-align: left;
  letter-spacing: 0px;
  color: ${({ theme: { colors } }) => colors.black}
  text-transform: capitalize;
  opacity: 1;
  margin-bottom: 15px;
`;

const HomeParagraph = styled.span`
  font: ${({ theme: { macroFont } }) => macroFont.tinyRegular};
  text-align: left;
  letter-spacing: 0px;
  color: ${({ theme: { colors } }) => colors.black}
  text-transform: capitalize;
  opacity: 1;
  margin-bottom: 20px;
`;

const HomeButtonText = styled.span`
  font: ${({ theme: { macroFont } }) => macroFont.tinyBold};
  text-align: left;
  letter-spacing: 0px;
  color: ${({ theme: { colors } }) => colors.black}
  text-transform: capitalize;
  opacity: 1;
  padding: 0px 20px;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
    `${mediaQueries.mobileSmallPixel + 1}px`}) {
    padding: 0px;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  width: 100%;
`;

function LoginContainer(props) {
  const auth = useContext(AuthContext);
  const viewport = useContext(ViewportContext);

  const login = async () => {
    await auth.login();
  };

  return (
    <>
      {viewport.isMobile && (
        <HomeTopContainer>
          <KadenaTorusIcon style={{ maxWidth: "100%" }} />
        </HomeTopContainer>
      )}

      <HomeContainer>
        {!viewport.isMobile && (
          <HomeLeftContainer>
            <KadenaTorusIcon style={{ maxWidth: "100%" }} />
          </HomeLeftContainer>
        )}

        <HomeRightContainer>
          <HomeRightContent>
            <HomeTitle>Hi, Welcome Back!</HomeTitle>
            <HomeSubTitle>Access your Wallet</HomeSubTitle>
            <HomeParagraph>Login using Google via Direct Auth</HomeParagraph>

            {auth.loading ? (
              <Dimmer active style={{ borderRadius: "16px" }}>
                <Loader content="Retrieving your data.." />
              </Dimmer>
            ) : (
              <Button
                primary
                onClick={login}
                style={{
                  background: `${theme.colors.white}  0% 0% no-repeat padding-box`,
                  boxShadow: theme.boxshadow,
                  color: theme.colors.black,
                  flexFlow: "row",
                }}
              >
                <ButtonContent>
                  <GoogleIcon style={{ marginRight: "25px" }} />
                  <HomeButtonText>Sign in with Google</HomeButtonText>
                </ButtonContent>
              </Button>
            )}
          </HomeRightContent>
        </HomeRightContainer>
      </HomeContainer>
    </>
  );
}

export default LoginContainer;
