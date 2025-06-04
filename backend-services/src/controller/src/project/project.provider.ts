import { controller } from 'controller-proto/codegen/tenant_pb';
import { IOrderDTO } from 'src/shared/order.interface';
import { DeleteResult } from 'typeorm';
import { Project } from './project.entity';
import { ProjectCompany } from './projectCompany.entity';

export class ProjectProvider {
  static buildProjects(title: string): Project[] {
    return [this.buildProject(title)];
  }

  static buildProject(title: string): Project {
    const project: any = new Project();
    project.id = 1;
    project.title = title;
    project.collaborations = [];
    return project;
  }

  static buildCompanyProjectsPayload(projectId: number): controller.CompanyProjectsPayload {
    const companyProjects = new controller.CompanyProjectsPayload();
    companyProjects.projectId = projectId;
    return companyProjects;
  }

  static buildProjectCompanies(id: number, companyId: string): ProjectCompany[] {
    return [this.buildProjectCompany(id, companyId)];
  }

  static buildFindAndCountProjectCompanies(id: number, companyId: string): ProjectCompany[] {
    const projectCompaniesResult = this.buildProjectCompany(id, companyId);
    const count = 1;
    return [projectCompaniesResult, count] as any;
  }

  static buildProjectCompany(id: number, companyId: string): ProjectCompany {
    const projectCompany = new ProjectCompany();
    projectCompany.id = id;
    projectCompany.companyId = companyId;
    return projectCompany;
  }

  static buildDeleteResult(): DeleteResult {
    const deleteResult = new DeleteResult();
    deleteResult.affected = 1;
    return deleteResult;
  }

  static buildOrder(): IOrderDTO {
    return { key: 'created', direction: 'DESC' };
  }
}
