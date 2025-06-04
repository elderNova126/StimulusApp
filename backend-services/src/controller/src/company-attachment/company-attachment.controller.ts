import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { CompanyAttachment } from './company-attachment.entity';
import { CompanyAttachmentService } from './company-attachment.service';

@Controller('CompanyAttachment')
export class CompanyAttachmentController {
  constructor(
    private companyAttachmentService: CompanyAttachmentService,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = CompanyAttachmentController.name;
  }

  @GrpcMethod('DataService', 'CreateCompanyAttachment')
  async createAttachment(data: any): Promise<CompanyAttachment> {
    return this.companyAttachmentService.createAttachment(data.companyAttachment);
  }

  @GrpcMethod('DataService', 'DeleteCompanyAttachment')
  async deleteAttachment(data: any): Promise<any> {
    const { id, userId } = data;

    await this.companyAttachmentService.deleteAttachment(id, userId);
    return { done: true };
  }

  @GrpcMethod('DataService', 'UpdateCompanyAttachment')
  updateAttachment(data: any): Promise<CompanyAttachment> {
    const {
      companyAttachment: { id, ...attachment },
      userId,
    } = data;

    return this.companyAttachmentService.updateAttachment(id, attachment, userId);
  }

  @GrpcMethod('DataService', 'GetCompanyAttachments')
  async searchAttachment(data: any) {
    const { companyAttachment: filters, pagination, order } = data;

    const [results, count] = await this.companyAttachmentService.getAttachments(filters, order, pagination);
    return { results, count };
  }

  @GrpcMethod('DataService', 'GetCompanyAttachmentsByCompanyId')
  async searchAttachmentByCompanyId(data: any) {
    const { companyId, type, tenantId, pagination, order } = data;

    const [results, count] = await this.companyAttachmentService.getAttachmentsByCompanyId(
      companyId,
      type ?? null,
      tenantId,
      order,
      pagination
    );
    return { results, count };
  }
}
