import React, { useState } from 'react';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import client from './apollo';
import ProtectedRoute from './components/ProtectedRoute';
import ViewsLogin from './views/Login';
import ViewsHome from './views/Home';
import ViewsNotFound from './views/NotFound';
import './App.css';

const App = () => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('c-at'));

  return (
    <ApolloProvider client={client}>
      <UserProvider loggedIn={loggedIn}>
        <Router>
          <Switch>
            <Route
              path="/login"
              exact
              render={() => <ViewsLogin setLoggedIn={setLoggedIn} />}
            />
            <ProtectedRoute exact path="/" component={ViewsHome} />
            <ProtectedRoute component={ViewsNotFound} />
          </Switch>
        </Router>
      </UserProvider>
    </ApolloProvider>
  );
};

export default App;
