import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import styled from "styled-components/macro";
import { AuthContext } from "../contexts/AuthContext";
import DashboardContainer from "../containers/DashboardContainer";
import LoginContainer from "../containers/LoginContainer";
import { ROUTE_DASHBOARD, ROUTE_LOGIN, ROUTE_TRANSFER } from "./routes";
import TransferContainer from "../containers/TransferContainer";

const MainContainer = styled.div`
  display: flex;
  flex-flow: column;
  align: center;
  height: 100%;
`;

const AppRouter = () => {
  const auth = useContext(AuthContext);

  return (
    <Router>
      <MainContainer className="App">
        {auth.user ? (
          <Switch>
            <Route exact path={ROUTE_LOGIN}>
              <Redirect to={ROUTE_DASHBOARD} />
            </Route>
            <Route
              exact
              path={ROUTE_DASHBOARD}
              component={DashboardContainer}
            />
            <Route exact path={ROUTE_TRANSFER} component={TransferContainer} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path={ROUTE_LOGIN} component={LoginContainer} />
            <Redirect to={ROUTE_LOGIN} />
          </Switch>
        )}
      </MainContainer>
    </Router>
  );
};

export default AppRouter;
