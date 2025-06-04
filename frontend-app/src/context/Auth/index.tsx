import {
  AccountInfo,
  EventType,
  InteractionRequiredAuthError,
  InteractionType,
  PublicClientApplication,
  IPublicClientApplication,
} from '@azure/msal-browser';
import { MsalAuthenticationTemplate, MsalProvider, useAccount, useMsal } from '@azure/msal-react';
import { createContext, FC, useEffect, useState } from 'react';
import config from '../../config/environment.config';
import { isAnonymousRoute } from '../../utils/string';
import { removeTenantContext } from '../LocalStorage/index';
import { msalConfig, resetPasswordInAuthority } from './AuthConfig';
import { sendMicroLoggingAlertOnSlack } from '../../utils/email';

const DefaultUserProps = {
  id: '',
  company_name: '',
  exp: 0,
  family_name: '',
  given_name: '',
  iat: 0,
  iss: '',
  job_title: '',
  nbf: 0,
  nonce: '',
  sub: '',
};
export const AuthContext = createContext({
  reloadToken: () => Promise.resolve(null), // tslint:disable-line: no-empty
  user: DefaultUserProps,
  authToken: '',
  logout: () => {}, // tslint:disable-line: no-empty
});

// Authentication Parameters
const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.enableAccountStorageEvents();

export const AzureAdProvider = (props: { children: any }) => {
  if (isAnonymousRoute(window.location.pathname)) {
    return <>{props.children}</>;
  } else {
    return (
      <MsalProvider instance={msalInstance}>
        <MainContent>{props.children}</MainContent>
      </MsalProvider>
    );
  }
};

const MainContent = (props: { children: any }) => {
  const { instance } = useMsal();

  /**
   * Using the event API, you can register an event callback that will do something when an event is emitted.
   * When registering an event callback in a react component you will need to make sure you do 2 things.
   * 1) The callback is registered only once
   * 2) The callback is unregistered before the component unmounts.
   * For more, visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/events.md
   */
  useEffect(() => {
    const callbackId = instance.addEventCallback((event: any) => {
      if (event.eventType === EventType.LOGIN_FAILURE) {
        if (event.error && event.error.errorMessage.indexOf('AADB2C90118') > -1) {
          const redirectAauthority: any = {
            authority: resetPasswordInAuthority,
          };
          instance.loginRedirect(redirectAauthority);
        }
      }

      if (event.eventType === EventType.LOGIN_SUCCESS) {
        if (event?.payload) {
          const account: any = event.payload;
          instance.setActiveAccount(account.account);
          /**
           * We need to reject id tokens that were not issued with the default sign-in policy.
           * "acr" claim in the token tells us what policy is used (NOTE: for new policies (v2.0), use "tfp" instead of "acr").
           * To learn more about B2C tokens, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/tokens-overview
           */
          if (event.payload.idTokenClaims.acr.toLowerCase() === config.AD_RESET_POLICY?.toLowerCase()) {
            return instance.logout();
          }
          if (account?.idTokenClaims) {
            sendSlackAlert(account.idTokenClaims.email);
          }
        }
      }
    });

    return () => {
      if (callbackId) {
        instance.removeEventCallback(callbackId);
      }
    };
  });

  const sendSlackAlert = async (email: string) => {
    try {
      await sendMicroLoggingAlertOnSlack({
        email: email,
        userAction: 'Sign On',
      });
    } catch (error) {
      console.error('Error sending Slack alert:', error);
    }
  };

  const authRequest = { scopes: ['openid'] };

  return (
    <MsalAuthenticationTemplate interactionType={InteractionType.Redirect} authenticationRequest={authRequest}>
      <AuthProvider>{props.children}</AuthProvider>
    </MsalAuthenticationTemplate>
  );
};

const AuthProvider: FC<any> = (props) => {
  const { instance, accounts, inProgress, logger } = useMsal();
  const [userData, setUserData] = useState(null) as any;
  const [authToken, setAuthToken] = useState('');
  const account = useAccount(accounts[0]);

  useEffect(() => {
    if (account && inProgress === 'none') {
      const request = {
        scopes: ['openid'],
        account,
      };
      instance
        .acquireTokenSilent(request)
        .then((response) => {
          logger.info('Token acquired');
          setUserData(response.idTokenClaims as any);
          setAuthToken(response.idToken);
        })
        .catch((error) => {
          logger.info('Error: ' + error.message);
          handleAuthError(error, account as AccountInfo);
        });
    }
  }, [account, inProgress, instance, logger]);

  useEffect(() => {
    if (userData && account) {
      const tokenExpiration = new Date(userData?.exp * 1000);
      const currentTime = new Date();
      const timeLeft = tokenExpiration.getTime() - currentTime.getTime();
      const tenPercentOfTokenExpiration = Math.trunc(timeLeft * 0.1);
      const refreshTokenTimer = setInterval(async () => {
        logger.info('Refreshing token');
        try {
          const request = {
            scopes: ['openid'],
            account: instance.getActiveAccount() ?? account,
          };
          const { idToken, idTokenClaims } = await instance.acquireTokenSilent(request);
          if (!idToken || !idTokenClaims) {
            logger.info('No token found, redirecting to login');
            handleLogout(instance);
          }
          setAuthToken(idToken);
          setUserData(idTokenClaims as any);
        } catch (error: any) {
          logger.info('Error: ' + error.message);
          handleLogout(instance);
        }
      }, timeLeft - tenPercentOfTokenExpiration);
      return () => clearInterval(refreshTokenTimer);
    }
  }, [userData, account, instance]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider
      value={{
        user: userData ?? DefaultUserProps,
        authToken,
        reloadToken: () => {
          return getIdToken(account)
            .then(({ token }: any) => {
              if (token) {
                const { idToken, idTokenClaims } = token;
                if (!idToken) {
                  logger.info('No token found, redirecting to login');
                  handleLogout(instance);
                }
                setUserData(idTokenClaims as any);
                setAuthToken(idToken);
                return token;
              }
            })
            .catch((error) => {
              logger.info('Error: ' + error.message);
              handleAuthError(error, account as AccountInfo);
            });
        },
        logout: () => {
          logger.info('Logout clicked');
          handleLogout(instance);
        },
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

async function getIdToken(account: AccountInfo | null) {
  if (account) {
    const request = {
      scopes: ['openid'],
      account,
    };
    const idToken = await msalInstance
      .acquireTokenSilent(request)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        // Do not fallback to interaction when running outside the context of MsalProvider. Interaction should always be done inside context.
        return null;
      });

    return idToken;
  }
}

async function handleLogout(instance: IPublicClientApplication) {
  removeTenantContext();
  instance.logoutRedirect({ postLogoutRedirectUri: '/' });
}

function handleAuthError(error: any, account: AccountInfo) {
  if (error instanceof InteractionRequiredAuthError) {
    const request = {
      scopes: ['openid'],
      account: account ?? undefined,
    };
    return msalInstance.acquireTokenRedirect(request);
  }
}
