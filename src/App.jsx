import React from "react";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import client from "./apollo";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewsLogin from "./views/Login";
import ViewsHome from "./views/Home";
import ViewsNotFound from "./views/NotFound";
import "./App.css";

const App = () => (
  <ApolloProvider client={client}>
    <Router>
      <Switch>
        <Route path="/login" exact component={ViewsLogin} />
        <ProtectedRoute path="/" exact component={ViewsHome} /> 
        <ProtectedRoute render={ViewsNotFound} />
      </Switch>
    </Router>
  </ApolloProvider>
);

export default App;
