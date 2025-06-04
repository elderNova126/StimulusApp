import { Scope } from '@nestjs/common';
import { ConnectionProviderService } from './connection-provider.service';
import { TENANT_CONNECTION, GLOBAL_CONNECTION, CONNECTION_PROVIDER } from './database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';

export const databaseProviders = [
  {
    provide: TENANT_CONNECTION,
    scope: Scope.REQUEST,
    useFactory: async (
      connectionProviderService: ConnectionProviderService,
      reqContextResolutionService: ReqContextResolutionService,
      logger: StimulusLogger
    ) => {
      const tenantId = reqContextResolutionService.getTenantId();
      if (!tenantId) {
        logger.error(`Missing tenant information in message`);
        return null;
      }
      logger.debug(`Resolving connection for tenant ${tenantId}`);
      let connection = null;
      try {
        connection = await connectionProviderService.getTenantConnection(tenantId);
      } catch (error) {
        logger.error(`Failed to resolve connection for tenant ${tenantId}`);
        logger.error(error);
      }
      return connection;
    },
    inject: [CONNECTION_PROVIDER, ReqContextResolutionService, StimulusLogger],
  },
  {
    provide: GLOBAL_CONNECTION,
    scope: Scope.REQUEST,
    useFactory: async (connectionProviderService: ConnectionProviderService) => {
      return await connectionProviderService.getGlobalConnection();
    },
    inject: [CONNECTION_PROVIDER],
  },
  {
    provide: CONNECTION_PROVIDER,
    scope: Scope.REQUEST,
    useExisting: ConnectionProviderService,
  },
  ConnectionProviderService,
];
