import { ApolloClient, ApolloProvider, concat, defaultDataIdFromObject, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from '@material-ui/core';
import { createUploadLink } from 'apollo-upload-client';
import 'focus-visible/dist/focus-visible';
import React, { useContext, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import config from './config/environment.config';
import { AuthContext, AzureAdProvider } from './context/Auth/index';
import { LocalStorageContext, LocalStorageProvider } from './context/LocalStorage/index';
import ErrorBoundary from './ErrorBoundary';
import HandleGrpcHook from './graphql/handleGrpcErrors';
import { useToken } from './hooks';
import './i18n';
import './index.css';
import possibleTypes from './possibleTypes.json';
import { store } from './stores/global';
import { CRITERIA_COMMA_SEPARATOR } from './utils/constants';
import StimulusTheme, { StimulusChakraTheme } from './Theme';
import { asyncWithLDProvider } from 'launchdarkly-react-client-sdk';

const cache = new InMemoryCache({
  dataIdFromObject: (res) => {
    if (res.__typename === 'UpdatesMeta') {
      return `${res.__typename}-from:${res.from}-to:${res.to}`;
    }
    if (res.__typename === 'Event') {
      return `${res.__typename}-code:${res.code}-id:${res.id}`;
    }
    return defaultDataIdFromObject(res);
  },
  possibleTypes,
  typePolicies: {
    StimulusScoreResponse: {
      merge(existing, incoming) {
        return incoming;
      },
    },
    Project: {
      fields: {
        projectCompany: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        selectionCriteria: {
          read: (criterias) =>
            (criterias || []).map((criteria: string) => criteria.replaceAll(CRITERIA_COMMA_SEPARATOR, ',')),
        },
      },
    },
    Query: {
      fields: {},
    },
  },
});

const GraphQLProvider = (props: any) => {
  const { tenantToken } = useContext(LocalStorageContext);
  const { authToken } = useToken();
  const { reloadToken } = useContext(AuthContext);
  const lastLoginDate =
    ('0' + (new Date().getMonth() + 1)).slice(-2) +
    '/' +
    ('0' + new Date().getDate()).slice(-2) +
    '/' +
    new Date().getFullYear();
  localStorage.setItem('lastLoginDate', lastLoginDate);
  const [handleGrpcErrors] = HandleGrpcHook();

  const client = useMemo(() => {
    return new ApolloClient({
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
        },
        query: {
          errorPolicy: 'all',
        },
        mutate: {
          errorPolicy: 'all',
        },
      },
      cache,
      link: concat(
        onError(({ graphQLErrors, networkError, forward, operation }) => {
          if (graphQLErrors?.[0]?.message === 'Unauthorized') {
            reloadToken().then(() => forward(operation));
          }
          // FIXME: This is a temporary fix for the issue with the GQL timeout
          if (
            graphQLErrors?.[0]?.extensions?.code !== 'INTERNAL_SERVER_ERROR' &&
            graphQLErrors?.[0]?.extensions?.code !== 'UNKNOWN' &&
            graphQLErrors?.[0]?.extensions?.code !== 'UNAVAILABLE'
          ) {
            handleGrpcErrors(graphQLErrors as any);
          }
        }),
        createUploadLink({
          uri: config.GRAPHQL_URI,

          headers: {
            authorization: authToken ? `Bearer ${authToken}` : '',
            ...(tenantToken && { 'x-scope-context': tenantToken }),
          },
        }) as any
      ),
    });
  }, [authToken, tenantToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};

(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: config.LAUNCH_DARKLY_CLIENT_SIDE_ID,
  });
  ReactDOM.render(
    <React.Fragment>
      <Provider store={store}>
        <AzureAdProvider>
          <ChakraProvider theme={StimulusChakraTheme}>
            <ThemeProvider theme={StimulusTheme}>
              <LocalStorageProvider>
                <GraphQLProvider>
                  <ErrorBoundary>
                    <LDProvider>
                      <App />
                    </LDProvider>
                  </ErrorBoundary>
                </GraphQLProvider>
              </LocalStorageProvider>
            </ThemeProvider>
          </ChakraProvider>
        </AzureAdProvider>
      </Provider>
    </React.Fragment>,
    document.getElementById('root')
  );
})();
