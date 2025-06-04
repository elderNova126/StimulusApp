import { Inject, Injectable } from '@nestjs/common';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { ProjectCollaborationArgs, ProjectCollaborationSearchArgs } from '../dto/projectCollaborationArgs';
import { ActionResponseUnion, BaseResponse } from '../models/baseResponse';
import {
  ProjectCollaboration,
  ProjectCollaborationsResponse,
  UserType,
  UserTypeMapping,
} from '../models/projectCollaboration';

@Injectable()
export class ProjectCollaborationService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  async setUserType(projectCollaborationArgs: ProjectCollaborationArgs): Promise<BaseResponse> {
    const { id, userType } = projectCollaborationArgs;
    if (!Object.values(UserType).includes(userType as UserType)) throw Error('Invalid user type for collaboration');
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.setUserCollaboration, {
      id,
      type: UserTypeMapping[userType],
    });
  }

  async createProjectCollaboration(projectCollaborationArgs: ProjectCollaborationArgs): Promise<ProjectCollaboration> {
    const { userId, userType, projectId } = projectCollaborationArgs;
    if (!Object.values(UserType).includes(userType as UserType)) throw Error('Invalid user type for collaboration');

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.sendProjectCollaboration, {
      user: {
        externalAuthSystemId: userId,
      },
      project: {
        id: projectId,
      },
      type: UserTypeMapping[userType],
    });
  }

  cancelCollaboration(projectCollaborationArgs: ProjectCollaborationArgs): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.cancelCollaboration, {
      ...projectCollaborationArgs,
    });
  }

  acceptCollaboration(projectCollaborationArgs: ProjectCollaborationArgs, userId): Promise<ProjectCollaboration> {
    const { id } = projectCollaborationArgs;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.setCollaborationStatus, {
      id,
      status: controller.UserCollaborationStatus.ACCEPTED,
      user: {
        id: userId,
      },
    });
  }

  async rejectCollaboration(projectCollaborationArgs: ProjectCollaborationArgs, userId): Promise<ProjectCollaboration> {
    const { id } = projectCollaborationArgs;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.setCollaborationStatus, {
      id,
      status: controller.UserCollaborationStatus.REJECTED,
      user: {
        id: userId,
      },
    });
  }

  async getProjectUserCollaborations(projectId, userId): Promise<ProjectCollaborationsResponse> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getUserCollaborations, {
      user: {
        externalAuthSystemId: userId,
      },
      projectPayload: {
        project: {
          id: projectId,
        },
      },
    });
  }

  async searchUserCollaborations(
    projectCollaborationSearchArgs: ProjectCollaborationSearchArgs
  ): Promise<ProjectCollaborationsResponse> {
    const { page, limit, orderBy, direction, userId, startDate, endDate, title, status } =
      projectCollaborationSearchArgs;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getUserCollaborations, {
      pagination: { page, limit },
      order: { orderBy, direction },
      projectPayload: {
        project: { startDate, endDate, title },
        statusIn: [status],
      },
      user: {
        externalAuthSystemId: userId,
      },
    });
  }

  async searchProjectCollaborations(
    projectCollaborationSearchArgs: ProjectCollaborationSearchArgs
  ): Promise<ProjectCollaborationsResponse> {
    const { page, limit, orderBy, direction, projectId, startDate, endDate, userType, title } =
      projectCollaborationSearchArgs;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getProjectCollaborations, {
      pagination: { page, limit },
      order: { orderBy, direction },
      projectPayload: {
        project: {
          id: projectId,
          startDate,
          endDate,
          title,
        },
      },
      ...(typeof userType !== 'undefined' && { type: UserTypeMapping[userType] }),
    });
  }
}
