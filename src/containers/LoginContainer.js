import React, { useContext} from "react";
import { Button, Loader, Dimmer } from 'semantic-ui-react';
import styled from 'styled-components/macro';
import { ReactComponent as HomeLogoImage } from "../assets/images/kadena-torus.svg";
import { ReactComponent as GoogleLogo } from "../assets/images/google_logo.svg";
import { AuthContext } from "../contexts/AuthContext";
import { ViewportContext } from "../contexts/ViewportContext";


const HomeContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: row;
  textAlign: center;
  margin: 72px 64px;
  height: 100%;
  padding: 10px 10px;
  border-radius: 24px;
  border: 24px;
  box-shadow: 0px 4px 56px #8383833D;
  align-items: center;
  justify-content: center;
  opacity: 1;
  background: transparent radial-gradient(closest-side at 31% -64%, #2B237C 0%, #251C72 31%, #0F054C 100%) 0% 0% no-repeat padding-box;;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    margin: 30px 18px 18px;
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
  /* height: 100%; */
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
  background: #FFFFFF 0% 0% no-repeat padding-box;
  border-radius: 16px;
  opacity: 1;
  @media (max-width: ${({ theme: { mediaQueries } }) =>
      `${mediaQueries.mobilePixel + 1}px`}) {
    width: 100%;
    padding: 0px;
  }
`;

const HomeRightContent = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: left;
  align-items: left;
`;



const HomeTitle = styled.span`
  font: normal normal bold 32px/38px roboto-bold;
  text-align: left;
  letter-spacing: 0px;
  color: #212121;
  text-transform: capitalize;
  opacity: 1;
  margin-bottom: 25px;
`;

const HomeSubTitle = styled.span`
  font: normal normal bold 24px/32px roboto-regular;
  text-align: left;
  letter-spacing: 0px;
  color: #212121;
  text-transform: capitalize;
  opacity: 1;
  margin-bottom: 15px;
`;

const HomeParagraph = styled.span`
  font: normal normal normal 16px/21px roboto-regular;
  text-align: left;
  letter-spacing: 0px;
  color: #212121;
  text-transform: capitalize;
  opacity: 1;
  margin-bottom: 20px;
`;

const HomeButtonText = styled.span`
  font: normal normal bold 17px/21px roboto-bold;
  text-align: left;
  letter-spacing: 0px;
  color: #212121;
  text-transform: capitalize;
  opacity: 1;
  padding: 0px 20px;
`;


const ButtonContent = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  width: 100%;
`;


function LoginContainer (props) {

  const auth = useContext(AuthContext);
  const viewport = useContext(ViewportContext)

  const login = async () => {
     await auth.login();
  }

    return (
        
      <>
        {viewport.isMobile && 
          <HomeTopContainer className="desktop-none">
            <HomeLogoImage className="desktop-none" style={{ maxWidth: "100%" }} />
          </HomeTopContainer>
         
        }
        
        
        <HomeContainer >
          {!viewport.isMobile &&
            <HomeLeftContainer>
              <HomeLogoImage className="mobile-none" style={{maxWidth: "100%"}}/>
            </HomeLeftContainer>
          }
            
            <HomeRightContainer>
            <HomeRightContent>
                <HomeTitle>Hi, Welcome Back!</HomeTitle>
                <HomeSubTitle>Access your Wallet</HomeSubTitle>
                <HomeParagraph>Login using Google via Direct Auth</HomeParagraph>
                
            
            
            {
            auth.loading ? (
                <Dimmer active style={{borderRadius: "16px"}}>
                    <Loader content='Retrieving your data..' />
                </Dimmer>
            ) : (
            <Button primary onClick={login} style={{ background: "#FFFFFF 0% 0% no-repeat padding-box", boxShadow: "0px 2px 6px #0000001A", color: "#212121", flexFlow: "row" }}>
                <ButtonContent>
                <GoogleLogo style={{marginRight: "25px"}} />
                <HomeButtonText >Sign in with Google</HomeButtonText>
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