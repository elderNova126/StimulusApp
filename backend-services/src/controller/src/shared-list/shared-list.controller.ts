import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { LoggingInterceptor } from 'src/logging/logger.interceptor';
import { SharedListService } from './shared-list.service';
import { controller } from 'controller-proto/codegen/tenant_pb';

@Controller('shared-list')
@UseInterceptors(LoggingInterceptor)
export class SharedListController {
  constructor(
    private sharedListService: SharedListService,
    private readonly reqContextResolutionService: ReqContextResolutionService
  ) {}

  @GrpcMethod('DataService', 'GetSharedList')
  async GetSharedList(): Promise<any> {
    const externalUserId = this.reqContextResolutionService.getUserId();
    const sessionTenantId = this.reqContextResolutionService.getTenantId();
    const results = await this.sharedListService.getSharedList(externalUserId, sessionTenantId);
    return { results, count: results.length };
  }

  @GrpcMethod('DataService', 'CreatedSharedList')
  async CreatedSharedList(shareListPayload: controller.ISharedListPayload): Promise<any> {
    const sessionExternalUserId = this.reqContextResolutionService.getUserId();
    const sessionTenantId = this.reqContextResolutionService.getTenantId();
    if (!shareListPayload.tenant) {
      shareListPayload = { ...shareListPayload, tenant: { id: sessionTenantId } };
    }
    const result = await this.sharedListService.createdSharedList(sessionExternalUserId, shareListPayload);
    return result;
  }

  @GrpcMethod('DataService', 'ChangeStatus')
  async ChangeStatus(shareListPayload: controller.ISharedListPayload): Promise<any> {
    const sessionExternalUserId = this.reqContextResolutionService.getUserId();
    return await this.sharedListService.updateInvitation(sessionExternalUserId, shareListPayload);
  }

  @GrpcMethod('DataService', 'GetCollaboratorsList')
  async GetCollaboratorsList(shareListPayload: controller.ISharedListPayload): Promise<any> {
    const sessionTenantId = this.reqContextResolutionService.getTenantId();
    const results = await this.sharedListService.getCollaboratorsList(sessionTenantId, shareListPayload);
    return { results, count: results.length };
  }
}
