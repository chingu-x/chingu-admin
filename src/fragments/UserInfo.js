import gql from 'graphql-tag';

export default gql`
  fragment UserInfo on User {
    id
    email
    name
    role
  }
`;
