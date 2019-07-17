import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';

const cache = new InMemoryCache();

const httpLink = new HttpLink({
  uri: 'https://chingu.appspot.com/graphql',
  credentials: 'omit'
});

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        for (let err of graphQLErrors) {
          switch (err.extensions.code) {
            default:
              const { message, locations, path } = err;
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
              );
          }
        }
      }
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    setContext(() => {
      const idToken = localStorage.getItem('c-at');

      return idToken
        ? {
            headers: {
              Authorization: idToken
            }
          }
        : {};
    }),
    httpLink
  ]),
  cache
});

export default client;
