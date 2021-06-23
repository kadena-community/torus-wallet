import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import DashboardContainer from './DashboardContainer';
import LoginContainer from './LoginContainer';
import styled from 'styled-components/macro';

const OuterContainer = styled.div`
  display: flex;
  flex-flow: column;
  align: center;
  height:100%;
`;

function SwitchContainer() {
    const auth = useContext(AuthContext);

    return (
        <OuterContainer className="App">
            {auth.user ? <DashboardContainer /> : <LoginContainer />}
        </OuterContainer>
    );
}

export default SwitchContainer;