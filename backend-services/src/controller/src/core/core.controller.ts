import { Controller, UseInterceptors } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { controller } from 'controller-proto/codegen/tenant_pb';

@Controller('core')
@UseInterceptors(LoggingInterceptor)
export class CoreController {
  constructor(private connectionService: ConnectionService) {}

  @GrpcMethod('NormalizerService', 'CheckTenantConnection')
  async checkConnection(): Promise<any> {
    return { connected: this.connectionService.tenantConnectionStatus() };
  }

  @GrpcMethod('DataService', 'MigrateTenant')
  async migrateTenant(_migrateTenantPayload: controller.IMigrateTenantPayload) {
    return this.connectionService.migrateTenant();
  }

  @GrpcMethod('DataService', 'ReverseLastTenantMigration')
  async reverseLastTenantMigration(_migrateTenantPayload: controller.IMigrateGlobalPayload) {
    return this.connectionService.reverseLastTenantMigration();
  }

  @GrpcMethod('DataService', 'MigrateGlobal')
  async migrateGlobal(_migrateTenantPayload: controller.IMigrateGlobalPayload) {
    return this.connectionService.migrateGlobal();
  }
}
