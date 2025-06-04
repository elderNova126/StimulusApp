import { controller } from 'controller-proto/codegen/tenant_pb';
import { IOrderDTO } from 'src/shared/order.interface';
import { DeleteResult } from 'typeorm';
import { EntityProjectType, GlobalProject } from './project-tree.entity';

export class GlobalProjectProvider {
  static buildGlobalProjects(projectId: number, entityId: string): GlobalProject[] {
    return [this.buildGlobalProject(projectId, entityId, true), this.buildGlobalProject(projectId + 1, entityId, true)];
  }

  static buildGlobalProject(projectId: number, entityId: string, hasTree?: boolean): GlobalProject {
    const globalProject: any = new GlobalProject();
    globalProject.id = Math.floor(Math.random() * 100) + 1;
    globalProject.projectId = projectId;
    globalProject.entityId = entityId;
    globalProject.entityType = EntityProjectType.TENANT;
    globalProject.subProjects = hasTree
      ? [this.buildGlobalProject(projectId + 1, entityId), this.buildGlobalProject(projectId + 2, entityId)]
      : [];
    globalProject.parentProject = hasTree ? this.buildGlobalProject(projectId - 1, entityId) : null;
    return globalProject;
  }

  static buildCompanyProjectsPayload(projectId: number): controller.CompanyProjectsPayload {
    const companyProjects = new controller.CompanyProjectsPayload();
    companyProjects.projectId = projectId;
    return companyProjects;
  }

  static buildDeleteResult(): DeleteResult {
    const deleteResult = new DeleteResult();
    deleteResult.affected = 1;
    return deleteResult;
  }

  static buildOrder(): IOrderDTO {
    return { key: 'id', direction: 'DESC' };
  }
}
