import { Controller, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { TenantService } from './tenant.service';
import { GrpcMethod } from '@nestjs/microservices';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';

@Controller('tenant')
@UseInterceptors(LoggingInterceptor)
export class TenantController {
  constructor(
    private tenantService: TenantService,
    private readonly reqContextResolutionService: ReqContextResolutionService
  ) {}

  @GrpcMethod('DataService', 'GetAccountInfo')
  async getAccountInfo(): Promise<any> {
    const tenantId = this.reqContextResolutionService.getTenantId();
    return await this.tenantService.getAccountInfo(tenantId);
  }

  @GrpcMethod('DataService', 'GetUserAccount')
  async getUserAccount(): Promise<any> {
    const tenantId = this.reqContextResolutionService.getTenantId();
    return this.tenantService.getUserAccount(tenantId);
  }

  @GrpcMethod('DataService', 'GetAllTenants')
  async getAllTenants(): Promise<any> {
    const tenants = await this.tenantService.getAllTenants();

    return { tenants: tenants };
  }

  @GrpcMethod('DataService', 'CreateTenant')
  async createTenant(createTenantPayload: controller.ICreateTenantPayload) {
    try {
      await this.tenantService.createTenant(createTenantPayload);

      return { created: true };
    } catch (error) {
      // handles all errors can appear in tenant creation
      return {
        created: false,
        error,
      };
    }
  }
}
