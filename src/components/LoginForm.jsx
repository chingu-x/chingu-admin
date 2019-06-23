import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import gql from "graphql-tag";

const LOGIN = gql`
  mutation logIn($email: String!, $password: String!) {
    logIn(email: $email, password: $password) {
      user {
        id
        name
        email
        role
      }
      tokens {
        refreshToken
        accessToken
      }
    }
  }
`;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Mutation mutation={LOGIN}>
      {(login, { data, loading, called, error }) => {
        if (called && !error && !loading) {
          if (data.logIn) {
            localStorage.setItem("t-rt", data.logIn.tokens.refreshToken);
            localStorage.setItem("t-at", data.logIn.tokens.accessToken);
            return <Redirect to="/" />;
          }
        }

        return (
          <form
            onSubmit={e => {
              e.preventDefault();
              login({ variables: { email, password } });
            }}
          >
            <input
              name="email"
              type="text"
              placeholder="user@chingu.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              name="password"
              type="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              Login
            </button>
          </form>
        );
      }}
    </Mutation>
  );
}

export default LoginForm;
