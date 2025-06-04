import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { Attachment } from './attachment.entity';
import { AttachmentService } from './attachment.service';

@Controller('attachment')
export class AttachmentController {
  constructor(
    private projectAttachmentService: AttachmentService,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = AttachmentController.name;
  }

  @GrpcMethod('DataService', 'CreateProjectAttachment')
  async createAttachment(data: any): Promise<Attachment> {
    return this.projectAttachmentService.createAttachment(data.projectAttachment);
  }

  @GrpcMethod('DataService', 'DeleteProjectAttachment')
  async deleteAttachment(data: any): Promise<any> {
    const { id, userId } = data;

    await this.projectAttachmentService.deleteAttachment(id, userId);
    return { done: true };
  }

  @GrpcMethod('DataService', 'UpdateProjectAttachment')
  updateAttachment(data: any): Promise<Attachment> {
    const {
      projectAttachment: { id, ...attachment },
      userId,
    } = data;

    return this.projectAttachmentService.updateAttachment(id, attachment, userId);
  }

  @GrpcMethod('DataService', 'GetProjectAttachments')
  async searchAttachment(data: any) {
    const { projectAttachment: filters, pagination, order } = data;

    const [results, count] = await this.projectAttachmentService.getAttachments(filters, order, pagination);
    return { results, count };
  }
}
