import { Injectable, Scope, Inject } from '@nestjs/common';
import { TENANT_CONNECTION, GLOBAL_CONNECTION } from '../database/database.constants';
import { Connection, Repository } from 'typeorm';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { ConnectionProviderService } from '../database/connection-provider.service';
import { Tenant, ProvisionStatus } from 'src/tenant/tenant.entity';

@Injectable({ scope: Scope.REQUEST })
export class ConnectionService {
  connection: Connection;
  private readonly tenantRepository: Repository<Tenant>;
  constructor(
    @Inject(GLOBAL_CONNECTION) private readonly globalConnection: Connection,
    @Inject(TENANT_CONNECTION) private readonly tenantConnection: Connection,
    private readonly logger: StimulusLogger,
    private connectionProviderService: ConnectionProviderService
  ) {
    this.tenantRepository = globalConnection.getRepository(Tenant);
  }

  tenantConnectionStatus(): boolean {
    return this.tenantConnection ? this.tenantConnection.isConnected : false;
  }
  async reverseLastTenantMigration(): Promise<any> {
    try {
      const tenatsToMigrate = await this.tenantRepository.find({
        where: { provisionStatus: ProvisionStatus.PROVISIONED },
        select: ['id', 'name'],
      });
      for (const tenant of tenatsToMigrate) {
        const tenantConection = await this.connectionProviderService.getTenantConnection(tenant.id);
        await tenantConection.undoLastMigration({ transaction: 'all' });
        this.logger.log(`tenant ${tenant.name} reverse successful `);
      }
      return {
        synchronized: true,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        synchronized: false,
        error: error.message,
      };
    }
  }

  async migrateTenant(): Promise<any> {
    try {
      const tenatsToMigrate = await this.tenantRepository.find({
        where: { provisionStatus: ProvisionStatus.PROVISIONED },
        select: ['id', 'name'],
      });
      for (const tenant of tenatsToMigrate) {
        const tenantConection = await this.connectionProviderService.getTenantConnection(tenant.id);
        await tenantConection.runMigrations({ transaction: 'all' });
        this.logger.log(`tenant ${tenant.name} synchronization successful `);
      }
      return {
        synchronized: true,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        synchronized: false,
        error: error.message,
      };
    }
  }

  async migrateGlobal(): Promise<any> {
    try {
      await this.globalConnection.synchronize();
      await this.globalConnection.runMigrations({ transaction: 'all' });
      this.logger.log(`global synchronization successful `);
      return {
        synchronized: true,
      };
    } catch (error) {
      this.logger.error(error);
      return {
        synchronized: false,
        error: error.message,
      };
    }
  }
}
