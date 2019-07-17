import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { GET_USERS } from './UserList';
import { UserInfo } from '../fragments';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#fff',
    height: '85vh',
    position: 'relative'
  }
}));

export const CREATE_USER = gql`
  ${UserInfo}

  mutation createUser($user: UserCreateInput!) {
    createUser(user: $user) {
      ...UserInfo
    }
  }
`;

export default function CreateUserForm(props) {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const classes = useStyles();

  return (
    <Mutation mutation={CREATE_USER} refetchQueries={[{ query: GET_USERS }]}>
      {(createUser, { loading, error, data }) => {
        return (
          <form
            className={classes.form}
            onSubmit={e => {
              e.preventDefault();
              createUser({ variables: { user: { email, name } } });
            }}
            noValidate
          >
            <Grid container alignItems="center" spacing={3}>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  name="email"
                  label="Email"
                  type="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  Add User
                </Button>
              </Grid>
            </Grid>
          </form>
        );
      }}
    </Mutation>
  );
}
