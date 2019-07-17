import React from 'react';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import UserContext from '../contexts/UserContext';
import LoginForm from '../components/LoginForm';
import AppShell from './AppShell';

function Login(props) {
  const { setLoggedIn } = props;

  return (
    <UserContext.Consumer>
      {user =>
        user ? (
          <Redirect to="/" />
        ) : (
          <AppShell drawer={false}>
            <Grid item xs={12}>
              <Container maxWidth="xs">
                <LoginForm setLoggedIn={setLoggedIn} />
              </Container>
            </Grid>
          </AppShell>
        )
      }
    </UserContext.Consumer>
  );
}

export default Login;
