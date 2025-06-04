import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import {
  CollaborationStatusMapping,
  ProjectCollaboration,
  UserTypeMapping,
  CollaborationStatus,
} from './project-collaboration.entity';
import { ProjectCollaborationService } from './project-collaboration.service';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { GrpcCanceledException } from '../shared/utils-grpc/exception';
import { InternalEventService } from '../event/internal-event.service';
import { EventCode } from '../event/event-code.enum';

@Controller('project-collaboration')
@UseFilters(GrpcExceptionFilter)
export class ProjectCollaborationController {
  constructor(
    private projectCollaborationService: ProjectCollaborationService,
    private eventService: InternalEventService
  ) {}

  @GrpcMethod('DataService', 'SendProjectCollaboration')
  async sendProjectCollaboration(data: any): Promise<ProjectCollaboration> {
    const { project, user, type } = data;
    if (type === undefined || !(type in controller.UserCollaborationType))
      throw new GrpcCanceledException('Invalid type');
    const result = await this.projectCollaborationService.sendProjectCollaboration(
      project,
      user.externalAuthSystemId,
      UserTypeMapping[type]
    );

    if (result.status === CollaborationStatus.PENDING) {
      this.eventService.dispatchInternalEvent({
        code: EventCode.ADD_PROJECT_COLLABORATORS,
        data: { ...result, userId: user.externalAuthSystemId },
      });
    }
    return result;
  }

  @GrpcMethod('DataService', 'GetProjectCollaborations')
  async getProjectCollaborations(data: any): Promise<{ results: ProjectCollaboration[]; count: number }> {
    const {
      pagination,
      projectPayload: { project },
      order,
      type,
    } = data;
    const filters = { project, ...(typeof type !== 'undefined' && { userType: UserTypeMapping[type] }) };
    const [results, count] = await this.projectCollaborationService.getProjectCollaborations(
      filters,
      pagination,
      order
    );
    return { results, count };
  }

  @GrpcMethod('DataService', 'GetUserCollaborations')
  async getUserCollaborations(data: any): Promise<{ results: ProjectCollaboration[]; count: number }> {
    const { pagination, user, order, projectPayload } = data;
    const [results, count] = await this.projectCollaborationService.getUserCollaborations(
      user.externalAuthSystemId,
      pagination,
      order,
      projectPayload.project.startDate,
      projectPayload.project.endDate,
      projectPayload.project.title,
      projectPayload.statusIn[0]
    );

    return { results, count };
  }

  @GrpcMethod('DataService', 'CancelCollaboration')
  async cancelCollaborations(data: any): Promise<any> {
    const { id } = data;

    return { done: await this.projectCollaborationService.cancelCollaboration(id) };
  }

  @GrpcMethod('DataService', 'SetUserCollaboration')
  async setUserCollaboration(data: any): Promise<any> {
    const { id, type } = data;

    if (type === undefined || !(type in controller.UserCollaborationType))
      throw new GrpcCanceledException('Invalid type');
    const collaboration = await this.projectCollaborationService.setUserCollaboration(id, UserTypeMapping[type]);
    return { done: collaboration.userType === UserTypeMapping[type] };
  }

  @GrpcMethod('DataService', 'SetCollaborationStatus')
  async setCollaborationStatus(data: any): Promise<any> {
    const { id, user, status } = data;

    if (status === undefined || !(status in controller.UserCollaborationStatus))
      throw new GrpcCanceledException('Invalid status');
    const result = await this.projectCollaborationService.setCollaborationStatus(
      id,
      user,
      CollaborationStatusMapping[status]
    );

    this.eventService.dispatchInternalEvent({
      code: EventCode.RESPONSE_PROJECT_COLLABORATORS,
      data: { ...result, userId: user.id },
    });

    return result;
  }
}
