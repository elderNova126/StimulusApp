import { Inject, Injectable } from '@nestjs/common';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { InternalCompaniesDashboardArgs } from 'src/dto/companyArgs';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { DeleteArgs } from '../dto/deleteArgs';
import { NoteSearchArgs } from '../dto/noteArgs';
import {
  CloneProjectArgs,
  ProjectActivityLogArgs,
  ProjectArgs,
  ProjectCompaniesArgs,
  ProjectCompanyArgs,
  ProjectSearchArgs,
} from '../dto/projectArgs';
import { ActionResponseUnion } from '../models/baseResponse';
import { EventsResponseUnion } from '../models/event';
import {
  ProjectCompanyResponseUnion,
  ProjectCompanyUnion,
  ProjectUnion,
  ProjectsResponseUnion,
} from '../models/project';
import { ProjectNotesResponseUnion } from '../models/project-note';
import { RelationShipPanelInfoUnion } from '../models/projectClassifiedByStatus';

@Injectable()
export class ProjectService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  searchProjectsSubset(query: string) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.searchProjectsSubset, { query });
  }

  async searchProjects(
    projectSearchArgs: ProjectSearchArgs,
    userId,
    grpcMethod: string
  ): Promise<typeof ProjectsResponseUnion> {
    const { companyId, companyType, page, limit, orderBy, direction, statusIn, accessType, ...project } =
      projectSearchArgs;
    const pagination = { page, limit };
    const order = { key: orderBy, direction };

    const collaborationType = {
      owner: controller.UserCollaborationType.OWNER,
      collaborator: controller.UserCollaborationType.COLLABORATOR,
      viewer: controller.UserCollaborationType.VIEWER,
    };

    const collaboration = collaborationType[accessType];
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods[grpcMethod], {
      projectPayload: {
        companyId,
        project: { ...project, deleted: false }, // showing only projects with deleted flag set to false
        companyType,
        statusIn,
        ...(collaboration && { accessType: collaboration }),
        ...(userId && { userId }),
      },
      pagination,
      order,
    });
  }

  async searchAllProjects(projectSearchArgs: ProjectSearchArgs, userId): Promise<typeof ProjectsResponseUnion> {
    const { companyId, companyType, page, limit, orderBy, direction, statusIn, accessType, ...project } =
      projectSearchArgs;
    const pagination = { page, limit };
    const order = { key: orderBy, direction };

    const collaborationType = {
      owner: controller.UserCollaborationType.OWNER,
      collaborator: controller.UserCollaborationType.COLLABORATOR,
      viewer: controller.UserCollaborationType.VIEWER,
    };

    const collaboration = collaborationType[accessType];
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.searchAllProjects, {
      projectPayload: {
        companyId,
        project: { ...project, deleted: false }, // showing only projects with deleted flag set to false
        companyType,
        statusIn,
        ...(collaboration && { accessType: collaboration }),
        ...(userId && { userId }),
      },
      pagination,
      order,
    });
  }

  searchProjectCompanies(
    projectCompaniesArgs: ProjectCompanyArgs,
    userId: string
  ): Promise<typeof ProjectCompanyResponseUnion> {
    const { companyType, ...rest } = projectCompaniesArgs;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getProjectCompanies, {
      ...rest,
      ...(companyType && { type: companyType }),
      userId,
    });
  }

  getProjectCompanyEvaluation(data: { projectId: number }) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.GetProjectCompanyEvaluations, {
      ...data,
    });
  }

  async getProjectActivityLog(
    projectActivityArgs: ProjectActivityLogArgs,
    userId
  ): Promise<typeof EventsResponseUnion> {
    const { projectId, page, limit, orderBy, direction } = projectActivityArgs;
    const pagination = { page, limit };
    const order = { key: orderBy, direction };

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getProjectActivityLog, {
      projectPayload: { project: { id: projectId } },
      pagination,
      order,
      userId,
    });
  }

  createProject(projectArgs: ProjectArgs, createdBy: string): Promise<typeof ProjectUnion> {
    const { companyId, companyType, ...projectData } = projectArgs;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createProject, {
      project: { ...projectData, createdBy },
      companyId,
      companyType,
    });
  }

  cancelProject(projectArgs: DeleteArgs): Promise<typeof ProjectUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.cancelProject, projectArgs);
  }

  cloneProject(projectArgs: CloneProjectArgs, userId: string): Promise<typeof ProjectUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.cloneProject, {
      ...projectArgs,
      userId,
    });
  }

  updateProject(projectArgs: ProjectArgs, userId: string): Promise<typeof ProjectUnion> {
    if (projectArgs.endDate) {
      const date = new Date(projectArgs.endDate);
      projectArgs.endDate = date.toISOString();
    }
    if (projectArgs.startDate) {
      const date = new Date(projectArgs.startDate);
      projectArgs.startDate = date.toISOString();
    }
    if (projectArgs.expectedEndDate) {
      const date = new Date(projectArgs.expectedEndDate);
      projectArgs.expectedEndDate = date.toISOString();
    }
    if (projectArgs.expectedStartDate) {
      const date = new Date(projectArgs.expectedStartDate);
      projectArgs.expectedStartDate = date.toISOString();
    }
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateProject, {
      userId,
      projectPayload: {
        project: projectArgs,
      },
    });
  }

  addCompaniesToProject(projectCompaniesArgs: ProjectCompaniesArgs) {
    const { companyIds, projectId } = projectCompaniesArgs;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.addCompaniesToProject, {
      companyIds,
      projectId,
    });
  }

  updateProjectCompanies(projectCompaniesArgs: ProjectCompanyArgs): Promise<typeof ProjectCompanyUnion> {
    const { companyId, companyType, projectId } = projectCompaniesArgs;
    const grpcMethod = companyType ? 'updateProjectCompany' : 'removeCompanyFromProject';

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods[grpcMethod], {
      companyId,
      ...(companyType && { type: companyType }),
      projectId,
    });
  }

  answerProjectCriteria(projectCompaniesArgs: ProjectCompanyArgs): Promise<typeof ProjectCompanyUnion> {
    const { projectId, companyId, criteriaAnswers } = projectCompaniesArgs;
    let parsedAnswers = [];
    try {
      parsedAnswers = JSON.parse(criteriaAnswers);
    } catch (error) {
      console.error(error);
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.answerProjectCriteria, {
      projectId,
      companyId,
      criteriaAnswers: parsedAnswers,
    });
  }

  searchNotes(noteSearchArgs: NoteSearchArgs): Promise<typeof ProjectNotesResponseUnion> {
    const { query, projectId, page, limit, ...note } = noteSearchArgs;
    const pagination = { page, limit };
    const noteSearchGrpcArgs: any = { note, query, pagination };

    if (projectId) {
      noteSearchGrpcArgs.note.project = { id: projectId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchProjectNotes,
      noteSearchGrpcArgs
    );
  }

  markProjectAsDeleted(deleteArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.markProjectAsDeleted, deleteArgs);
  }

  getProjectEvaluation(projectId: number) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getProjectEvaluationTemplate, {
      projectId,
    });
  }

  getRelationShipPanelInfo(projectSearchArgs: ProjectSearchArgs, userId): Promise<typeof RelationShipPanelInfoUnion> {
    const { deleted, archived, companyId, ongoing } = projectSearchArgs;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.relationShipPanelInfo, {
      projectPayload: {
        companyId,
        project: { archived, deleted, ongoing },
        ...(userId && { userId }),
      },
    });
  }

  async getProjectsDashboard(projectDasboardArgs: InternalCompaniesDashboardArgs): Promise<any> {
    const { granularityFilter, timePeriodFilter } = projectDasboardArgs;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getProjectsDashboard, {
      granularityFilter,
      timePeriodFilter,
    });
  }

  async checkProjectsDataDashboard(): Promise<any> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.checkDataProjectsDashboard, {});
  }
}
