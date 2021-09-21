import React from "react";
import { useContext } from "react/cjs/react.development";
import styled from "styled-components";
import { AuthContext } from "../../contexts/AuthContext";
import CustomLoader from "../shared/CustomLoader";

import Header from "./header/Header";

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
  flex-flow: column;

  align-items: center;
  justify-content: center;
  margin-top: 24px;
  margin-left: auto;
  margin-right: auto;
  height: auto;
`;

const Layout = ({ loader, children }) => {
  const auth = useContext(AuthContext);
  return (
    <>
      <CustomLoader loader={auth.loading} message="Switching Network.." />
      {loader?.map((load) => load)}
      <MainContainer>
        <Header />
        <Container>{children}</Container>
      </MainContainer>
    </>
  );
};

export default Layout;
