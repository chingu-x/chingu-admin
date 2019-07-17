import React from 'react';
import { Query } from 'react-apollo';
import { UserInfo } from '../fragments';
import gql from 'graphql-tag';

const UserContext = React.createContext(null);

const GET_CURRENT_USER = gql`
  ${UserInfo}

  query getCurrentUser {
    me {
      ...UserInfo
    }
  }
`;

function UserProvider(props) {
  const { children, loggedIn } = props;

  return (
    <Query query={GET_CURRENT_USER} fetchPolicy="cache-first" skip={!loggedIn}>
      {({ data }) => {
        let user = loggedIn && {};

        if (data && data.me) {
          user = data.me;
        }

        return (
          <UserContext.Provider value={user}>{children}</UserContext.Provider>
        );
      }}
    </Query>
  );
}

export { UserContext as default, UserProvider, GET_CURRENT_USER };
