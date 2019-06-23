import { ApolloClient } from 'apollo-client';
import gql from "graphql-tag";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from "apollo-link-context";
import { ApolloLink, Observable, execute, makePromise } from 'apollo-link';

const cache = new InMemoryCache();

const httpLink = new HttpLink({
  uri: 'https://chingu.appspot.com/graphql',
  credentials: 'omit'
});

export function logOut() {
  localStorage.removeItem("t-at");
  localStorage.removeItem("t-rt");
  window.location.pathname = "/";
}

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
        for(let err of graphQLErrors) {
          switch(err.extensions.code) {
            case "UNAUTHENTICATED":
              if(localStorage.getItem("t-rt")) {
                return new Observable(observer => {
                  const refreshTokenOperation = {
                    query: gql`
                      mutation refreshAccessToken($refreshToken: String!) {
                        refreshAccessToken(refreshToken: $refreshToken) {
                          refreshToken
                          accessToken
                        }
                      }
                    `,
                    variables: {
                      refreshToken: localStorage.getItem("t-rt")
                    },
                    operationName: "refreshAccessToken"
                  };
  
                  makePromise(execute(httpLink, refreshTokenOperation)).then(({ data, errors }) => {
                    if(errors) {
                      throw errors[0];
                    }
                    const { refreshAccessToken } = data;
                    localStorage.setItem("t-at", refreshAccessToken.accessToken);
                    localStorage.setItem("t-rt", refreshAccessToken.refreshToken);
                    operation.setContext(({ headers = {} }) => ({
                      headers: {
                        ...headers,
                        authorization: refreshAccessToken.accessToken || null,
                      }
                    }));
                  }).catch((err) => {
                    console.error(err);
                    logOut();
                  }).then(() => {
                    const subscriber = {
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer)
                    };
  
                    // Retry last failed request
                    forward(operation).subscribe(subscriber);
                  }).catch(error => {
                    // No refresh or client token available, we force user to login
                    observer.error(error);
                  });
                });
              } else {
                logOut();
              }
              break;
            default:
              const { message, locations, path } = err;
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
              );
          }
        }
      }
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    setContext(() => {
      const token = localStorage.getItem("t-at");
      return {
        headers: {
          Authorization: token
        }
      };
    }),
    httpLink
  ]),
  cache
});

export default client;