import { LogLevel } from 'msal';
import config from '../../config/environment.config';

const logInAuthority = `${config.AD_B2C_URL}${config.AD_TENANT_ID}/${config.AD_SIGN_IN_POLICY}`;
export const resetPasswordInAuthority = `${config.AD_B2C_URL}${config.AD_TENANT_ID}/${config.AD_RESET_POLICY}`;

export const msalConfig = {
  auth: {
    authority: logInAuthority,
    clientId: config.AD_APPLICATION_ID,
    redirectUri: window.location.origin,
    knownAuthorities: [config.AD_TENANT, config.AD_INSTANCE, config.AD_B2C_URL, config.AD_TENANT_ID],
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'localStorage',
    // storeAuthStateInCookie: true
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: any, message: any, containsPii: any) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
}; // Authentication Parameters
