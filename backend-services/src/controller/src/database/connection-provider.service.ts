import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm';
import { AlreadyHasActiveConnectionError } from 'typeorm/error/AlreadyHasActiveConnectionError';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { StimulusSecretClientService } from '../core/stimulus-secret-client.service';
import { LoggingModule } from '../logging/logging.module';
import { StimulusDbLogger } from '../logging/stimulus-db-logger.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { EmailService } from '../email/email.service';
import * as globalConfig from './config/typeorm-global.config';
import * as tenantConfig from './config/typeorm-tenant.config';

@Injectable()
export class ConnectionProviderService {
  private readonly GLOBAL_CONNECTION_NAME: string = 'GLOBAL_CONNECTION';
  constructor(
    private readonly stimulusSecretClientService: StimulusSecretClientService,
    private readonly configService: ConfigService,
    private readonly logger: StimulusLogger,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private readonly emailService: EmailService
  ) {
    this.logger.context = ConnectionProviderService.name;
  }

  private getTenantDBNameSecretName(tenantId): string {
    return `${tenantId.toString()}-DB-NAME`;
  }

  private getTenantDBSchemaSecretName(tenantId): string {
    return `${tenantId.toString()}-DB-SCHEMA`;
  }

  private getTenantDBUserNameSecretName(tenantId): string {
    return `${tenantId.toString()}-DB-USERNAME`;
  }

  private getTenantDBUserPasswordSecretName(tenantId): string {
    return `${tenantId.toString()}-DB-PASSWORD`;
  }

  private getGlobalDBUserNameSecretName(): string {
    return 'GLOBAL-DB-USERNAME';
  }

  private getGlobalDBUserPasswordSecretName(): string {
    return 'GLOBAL-DB-PASSWORD';
  }

  public async getTenantConnection(tenantId: string): Promise<Connection> {
    try {
      let connection: Connection;
      if (!tenantId) return null;
      const connectionName = tenantId.toString();
      const dbLoggingEnabled = this.configService.get<string>('DB_LOGGING_ENABLED', 'false');
      const connectionManager = getConnectionManager();
      if (connectionManager.has(connectionName)) {
        connection = connectionManager.get(connectionName);
        if (!connection.isConnected) {
          this.logger.debug(`connection reconnect for tenant ${tenantId}`);
          return connection.connect();
        }
        this.logger.debug(`connection retrieved successfully for tenant ${tenantId}`);
      } else {
        this.logger.debug(`create connection for tenant ${tenantId}`);

        const { value: dbName } = await this.stimulusSecretClientService.getSecret(
          this.getTenantDBNameSecretName(tenantId)
        );

        const { value: dbSchema } = await this.stimulusSecretClientService.getSecret(
          this.getTenantDBSchemaSecretName(tenantId)
        );
        const { value: username } = await this.stimulusSecretClientService.getSecret(
          this.getTenantDBUserNameSecretName(tenantId)
        );
        const { value: password } = await this.stimulusSecretClientService.getSecret(
          this.getTenantDBUserPasswordSecretName(tenantId)
        );

        try {
          connection = await createConnection({
            ...tenantConfig,
            database: dbName,
            schema: dbSchema,
            name: connectionName,
            username,
            password,
            requestTimeout: 300000,
            logger: dbLoggingEnabled === 'true' ? LoggingModule.createStimulusDbLogger() : null,
          } as ConnectionOptions);
          connection.subscribers.push();
        } catch (error) {
          if (error instanceof AlreadyHasActiveConnectionError) {
            connection = connectionManager.get(connectionName);
          }
        }
      }
      this.logger.debug(`connected to ${tenantId} db`);
      if (dbLoggingEnabled === 'true') {
        const dbLogger = connection.logger as StimulusDbLogger;
        dbLogger.setRequestId(this.reqContextResolutionService.getRequestId());
      }
      return connection;
    } catch (error) {
      throw error;
    }
  }

  public async getGlobalConnection(): Promise<Connection> {
    let connection: Connection;
    const connectionManager = getConnectionManager();
    try {
      if (connectionManager.has(this.GLOBAL_CONNECTION_NAME)) {
        connection = connectionManager.get(this.GLOBAL_CONNECTION_NAME);
        if (!connection.isConnected) {
          this.logger.debug(`global connection reconnect`);
          const connectedConnection = await connection.connect();
          return connectedConnection;
        }
        this.logger.debug('global connection retrieved successfully');
      } else {
        this.logger.debug('create global connection');
        const { value: username } = await this.stimulusSecretClientService.getSecret(
          this.getGlobalDBUserNameSecretName()
        );
        const { value: password } = await this.stimulusSecretClientService.getSecret(
          this.getGlobalDBUserPasswordSecretName()
        );
        const dbLoggingEnabled = this.configService.get<string>('DB_LOGGING_ENABLED', 'false');

        connection = await createConnection({
          ...globalConfig,
          name: this.GLOBAL_CONNECTION_NAME,
          username: username,
          password: password,
          logger: dbLoggingEnabled === 'true' ? LoggingModule.createStimulusDbLogger() : null,
        } as ConnectionOptions);
      }
    } catch (error) {
      if (error instanceof AlreadyHasActiveConnectionError) {
        connection = connectionManager.get(this.GLOBAL_CONNECTION_NAME);
      } else {
        this.logger.error('error in global connection', error.message);
        const isLocal = process.env.ENVIRONMENT === 'local';
        if (!isLocal) {
          await this.emailService.sendConnectionErrorNotificationSlack(error);
        }
      }
    }
    this.logger.debug('`connected to global db');
    return connection;
  }
}
