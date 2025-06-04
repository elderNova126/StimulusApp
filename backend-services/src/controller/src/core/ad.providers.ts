import { Scope } from '@nestjs/common';
import { Client } from '@microsoft/microsoft-graph-client';
import { AdAuthProvider } from './ad-auth-provider.service';

export const AD_CLIENT = 'AdClient';

export const adProviders = [
  {
    provide: AD_CLIENT,
    scope: Scope.REQUEST,
    useFactory: async (adAuthProvider: AdAuthProvider) => {
      return Client.initWithMiddleware({
        authProvider: adAuthProvider,
        debugLogging: true,
      });
    },
    inject: [AdAuthProvider],
  },
  AdAuthProvider,
];
