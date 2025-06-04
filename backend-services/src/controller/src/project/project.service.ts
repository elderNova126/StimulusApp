/* eslint-disable */
import { Inject, Injectable, Scope } from '@nestjs/common';
import { controller } from 'controller-proto/codegen/tenant_pb';
import moment from 'moment';
import * as R from 'ramda';
import { from } from 'rxjs';
import { combineAll } from 'rxjs/operators';
import { GlobalSupplierService } from 'src/global-supplier/global-supplier.service';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { GlobalProjectService } from 'src/project-tree/project-tree.service';
import { getMonthName } from 'src/utils/date';
import { Brackets, Connection, EntityManager, In, LessThanOrEqual, Like, MoreThanOrEqual, Repository, TreeRepository } from 'typeorm';
import { Company } from '../company/company.entity';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from '../database/database.constants';
import { EvaluationService } from '../evaluation/evaluation.service';
import { EventCode } from '../event/event-code.enum';
import { DispatchEventsDTO, InternalEventService } from '../event/internal-event.service';

import { CollaborationStatus, UserTypeMapping } from '../project-collaboration/project-collaboration.entity';
import { ProjectCollaborationService } from '../project-collaboration/project-collaboration.service';
import { ProjectNote } from '../project-note/project-note.entity';
import { IOrderDTO } from '../shared/order.interface';
import { IPaginationDTO } from '../shared/pagination.interface';
import {
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
  GrpcUnavailableException
} from '../shared/utils-grpc/exception';
import {
  SupplierStatus,
  SupplierType,
  TenantCompanyRelationship
} from '../tenant-company-relationship/tenant-company-relationship.entity';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';
import { defaultTCR } from '../tenant-company-relationship/tenant-company-relationship.constants';
import { TenantCompany } from '../tenant/tenant-company.entity';
import { UserProfileService } from '../user-profile/user-profile.service';
import { User } from '../user/user.entity';
import { UserType } from './../project-collaboration/project-collaboration.entity';
import { CompanyType, ProjectStatus, defaultOtherProjectTitle } from './project.constants';
import { ProjectCompanyCountDTO, ProjectStatusCountDTO } from './project.dto';
import { Project } from './project.entity';
import { ProjectCompany } from './projectCompany.entity';
import { GlobalProject, EntityProjectType } from 'src/project-tree/project-tree.entity';
import { ConnectionProviderService } from '../database/connection-provider.service';
import { Attachment } from 'src/attachment/attachment.entity';

enum CloningRelation {
  REGULAR = 'REGULAR',
  SUBPROJECT = 'SUBPROJECT',
  CONTINUATION = 'CONTINUATION'
}
@Injectable({ scope: Scope.REQUEST })
export class ProjectService {
  private readonly projectRepository: Repository<Project>;
  private readonly projectCompanyRepository: Repository<ProjectCompany>;
  private readonly companyRepository: Repository<Company>;
  private readonly tenantCompanyRepository: Repository<TenantCompany>;
  private readonly tenantEntityManager: EntityManager;
  private readonly userRepository: Repository<User>;
  private readonly globalProjectRepository: TreeRepository<GlobalProject>;

  constructor(
    @Inject(TENANT_CONNECTION) tenantConnection: Connection,
    @Inject(GLOBAL_CONNECTION) globalConnection: Connection,
    private eventService: InternalEventService,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private userProfileService: UserProfileService,
    private projectCollaborationService: ProjectCollaborationService,
    private evaluationService: EvaluationService,
    private tenantRelationService: TenantCompanyRelationshipService,
    private globalProjectService: GlobalProjectService,
    private globalSupplierService: GlobalSupplierService,
    private logger: StimulusLogger,
    private connectionProviderService: ConnectionProviderService,
  ) {
    this.projectRepository = tenantConnection.getRepository(Project);
    this.projectCompanyRepository = tenantConnection.getRepository(ProjectCompany);
    this.companyRepository = globalConnection.getRepository(Company);
    this.tenantCompanyRepository = globalConnection.getRepository(TenantCompany);
    this.tenantEntityManager = tenantConnection.manager;
    this.userRepository = globalConnection.getRepository(User);
    this.globalProjectRepository = globalConnection.getTreeRepository(GlobalProject);
  }

  private checkIfprojectCanBeArchived(project: Project) {
    return [ProjectStatus.CANCELED, ProjectStatus.COMPLETED].indexOf(project.status as ProjectStatus) === -1;
  }
  async searchProjectsSubset(query: string) {
    const sqlQuery = this.projectRepository.createQueryBuilder('project').select();

    sqlQuery.addSelect('title');

    sqlQuery.where({ title: Like(`%${query}%`) });

    return sqlQuery.getMany();
  }

  async getAllProjects(
    filters: Project,
    pagination: IPaginationDTO,
    order: IOrderDTO,
    statusIn?: string[],
    userId?: string,
    accessType?: controller.UserCollaborationType
  ) {
    try {
      const {
        parentProject,
        startDate,
        expectedStartDate,
        expectedEndDate,
        endDate,
        title,
        archived,
        id,
        ...rest
      } = filters;
      const { limit = 10, page = 1 } = pagination ?? {};
      const filtersSearch = {
        ...rest,
        ...(id && { id }),
        ...(parentProject && { id: parentProject }),
        ...(startDate && { startDate: MoreThanOrEqual(startDate) }),
        ...(expectedStartDate && {
          expectedStartDate: MoreThanOrEqual(expectedStartDate)
        }),
        ...(endDate && { endDate: LessThanOrEqual(endDate) }),
        ...(expectedEndDate && {
          expectedEndDate: LessThanOrEqual(expectedEndDate)
        }),
        ...(title && { title: Like(`%${title}%`) })
      };
      return await this.tenantEntityManager.transaction(async transactionalEntityManager => {
        const query = transactionalEntityManager
          .createQueryBuilder(Project, 'project')
          .loadAllRelationIds({
            relations: ['projectCollaboration']
          })
          .leftJoinAndSelect('project.collaborations', 'projectCollaboration')
          .where(filtersSearch);

        if (statusIn?.length) {
          query.andWhere('project.status IN (:...statusIn)', { statusIn });
        }

        if (typeof accessType !== 'undefined') {
          const userTypeSwitch = {
            [controller.UserCollaborationType.OWNER]: UserType.OWNER,
            [controller.UserCollaborationType.COLLABORATOR]: UserType.COLLABORATOR,
            [controller.UserCollaborationType.VIEWER]: UserType.VIEWER
          };
          const userType = userTypeSwitch[accessType];

          userType && query.andWhere('projectCollaboration.userType=:userType', { userType });
        }

        if (userId) {
          const user = await this.userRepository.findOneOrFail({
            where: {
              externalAuthSystemId: userId
            }
          });

          query.andWhere(
            new Brackets(qb => {
              qb.andWhere('projectCollaboration.userId =:userId', {
                userId: user.id
              });
              qb.andWhere('projectCollaboration.status =:status', {
                status: CollaborationStatus.ACCEPT
              });
              if (archived || id) qb.orWhere('project.archived=:archived', { archived: 1 });
            })
          );
        }

        if (!id) {
          if (archived) query.andWhere('project.archived=:archived', { archived: 1 });
          if (archived === false) query.andWhere('project.archived=:archived', { archived: 0 });
        }

        // pagination
        if (limit > 0) {
          query.take(limit).skip(limit * (page - 1));
        }

        // order
        if (order) {
          const { key, direction } = order;
          query.orderBy(key, direction);
        }

        const [results, count] = await query.getManyAndCount();

        return [results, count];
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getAllSupplierTierProjects(
    filters: Project,
    pagination: IPaginationDTO,
    order: IOrderDTO,
    companyId: string,
    companyType?: CompanyType,
    statusIn?: string[],
    accessType?: controller.UserCollaborationType
  ) {
    try {
      const {
        parentProject,
        startDate,
        expectedStartDate,
        expectedEndDate,
        endDate,
        title,
        archived,
        id,
        ...rest
      } = filters;
      const { limit = 10, page = 1 } = pagination ?? {};
      const filtersSearch = {
        ...rest,
        ...(id && { id }),
        ...(parentProject && { id: parentProject }),
        ...(startDate && { startDate: MoreThanOrEqual(startDate) }),
        ...(expectedStartDate && {
          expectedStartDate: MoreThanOrEqual(expectedStartDate)
        }),
        ...(endDate && { endDate: LessThanOrEqual(endDate) }),
        ...(expectedEndDate && {
          expectedEndDate: LessThanOrEqual(expectedEndDate)
        }),
        ...(title && { title: Like(`%${title}%`) })
      };
      const tenantId = await this.reqContextResolutionService.getTenantId();
      const tierProjectsFromTenant: Project[] = [];
      const [SubProject, count] = await this.globalProjectService.getParentsProjectTreeFromSupplier({ supplierId: companyId, tenantId, limit, skip: limit * (page - 1) });
      if (!SubProject) return [[], 0];
      const mapOfTreeProject: Map<string, number[]> = new Map();

      for (const { entityId, projectId } of SubProject) {
        if (mapOfTreeProject.has(entityId))
          mapOfTreeProject.get(entityId).push(projectId)
        else
          mapOfTreeProject.set(entityId, [projectId]);
      }


      for (const [entityId, projectIds] of mapOfTreeProject) {
        const tenantConnection = await this.connectionProviderService.getTenantConnection(entityId);
        const query = tenantConnection.getRepository(Project).createQueryBuilder('project')
          .leftJoinAndSelect('project.projectCompany', 'projectCompany')
          .leftJoinAndSelect('projectCompany.evaluations', 'evaluation')
          .leftJoinAndSelect('project.collaborations', 'projectCollaboration')
          .where({ ...filtersSearch })
          .andWhere('project.id IN (:...projectIds)', { projectIds })
          .andWhere('project.status IN (:...status)', { status: [ProjectStatus.COMPLETED] })
          .andWhere('projectCompany.type = :type', { type: companyType || CompanyType.AWARDED })
          .orderBy('evaluation.created', 'DESC');

        if (statusIn?.length) {
          query.andWhere('project.status IN (:...statusIn)', { statusIn });
        }
        if (typeof accessType !== 'undefined') {
          const userTypeSwitch = {
            [controller.UserCollaborationType.OWNER]: UserType.OWNER,
            [controller.UserCollaborationType.COLLABORATOR]: UserType.COLLABORATOR,
            [controller.UserCollaborationType.VIEWER]: UserType.VIEWER
          };
          const userType = userTypeSwitch[accessType];

          userType && query.andWhere('projectCollaboration.userType=:userType', { userType });
        }

        if (order) {
          const { key, direction } = order;
          query.orderBy(key, direction);
        }

        const supplierProject = await query.getMany();
        if (supplierProject) tierProjectsFromTenant.push(...supplierProject);
      }

      for (const project of tierProjectsFromTenant) {
        project['scoreProject'] = this.findScoreProject(project, companyId);
      }

      return [tierProjectsFromTenant, count];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllOtherTierProjects(
    filters: Project,
    pagination: IPaginationDTO,
    order: IOrderDTO,
    companyId: string,
    companyType?: CompanyType,
    statusIn?: string[],
    accessType?: controller.UserCollaborationType
  ) {
    try {
      const {
        parentProject,
        startDate,
        expectedStartDate,
        expectedEndDate,
        endDate,
        title,
        archived,
        id,
        ...rest
      } = filters;
      const { limit = 10, page = 1 } = pagination ?? {};
      const filtersSearch = {
        ...rest,
        ...(id && { id }),
        ...(parentProject && { id: parentProject }),
        ...(startDate && { startDate: MoreThanOrEqual(startDate) }),
        ...(expectedStartDate && {
          expectedStartDate: MoreThanOrEqual(expectedStartDate)
        }),
        ...(endDate && { endDate: LessThanOrEqual(endDate) }),
        ...(expectedEndDate && {
          expectedEndDate: LessThanOrEqual(expectedEndDate)
        }),
        ...(title && { title: Like(`%${title}%`) })
      };
      const tenantId = await this.reqContextResolutionService.getTenantId();
      const globalProject = await this.globalProjectRepository.createQueryBuilder('globalProject')
        .leftJoinAndSelect('globalProject.GlobalSupplier', 'GlobalSupplier')
        .where('globalProject.entityId != :entityId', { entityId: tenantId })
        .andWhere('GlobalSupplier.companyId = :id', { id: companyId })
        .getMany();
      if (globalProject.length === 0) return [[], 0];

      const otherProjectsFromTenant: Project[] = [];
      const otherProjectIdsMap = new Map<string, number[]>();


      for (const project of globalProject) {
        if (project.entityType === EntityProjectType.TENANT) {
          if (otherProjectIdsMap.has(project.entityId))
            otherProjectIdsMap.get(project.entityId).push(project.projectId);
          else otherProjectIdsMap.set(project.entityId, [project.projectId]);
        }
      };
      for (const [entityId, projectIds] of otherProjectIdsMap) {
        const tenantConnection = await this.connectionProviderService.getTenantConnection(entityId);
        const query = tenantConnection.getRepository(Project).createQueryBuilder('project')
          .leftJoinAndSelect('project.projectCompany', 'projectCompany')
          .leftJoinAndSelect('projectCompany.evaluations', 'evaluation')
          .leftJoinAndSelect('project.collaborations', 'projectCollaboration')
          .where(filtersSearch)
          .andWhere('project.id IN (:...projectIds)', { projectIds })
          .andWhere('project.status IN (:...status)', { status: [ProjectStatus.COMPLETED] })
          .andWhere('projectCompany.type = :type', { type: companyType || CompanyType.AWARDED })
          .orderBy('evaluation.created', 'DESC');

        if (statusIn?.length) {
          query.andWhere('project.status IN (:...statusIn)', { statusIn });
        }

        if (typeof accessType !== 'undefined') {
          const userTypeSwitch = {
            [controller.UserCollaborationType.OWNER]: UserType.OWNER,
            [controller.UserCollaborationType.COLLABORATOR]: UserType.COLLABORATOR,
            [controller.UserCollaborationType.VIEWER]: UserType.VIEWER
          };
          const userType = userTypeSwitch[accessType];

          userType && query.andWhere('projectCollaboration.userType=:userType', { userType });
        }

        if (limit > 0) {
          query.take(limit).skip(limit * (page - 1));
        }

        // order
        if (order) {
          const { key, direction } = order;
          query.orderBy(key, direction);
        }

        const projects = await query.getMany()
        if (projects.length > 0) otherProjectsFromTenant.push(...projects);
      }

      const company = await this.companyRepository.findOne({ where: { id: companyId }, relations: ['industries'] });
      const [industry] = company.industries;

      for (const project of otherProjectsFromTenant) {
        project['scoreProject'] = this.findScoreProject(project, companyId);
        project.title = industry?.title || defaultOtherProjectTitle;
      }
      const otherProjectsFromTenantSorted = otherProjectsFromTenant.sort((a, b) => b.startDate > a.startDate ? 1 : -1);
      const LIMIT_TOP_PROJECTS = 5;
      return [otherProjectsFromTenantSorted.slice(0, LIMIT_TOP_PROJECTS), otherProjectsFromTenant.length];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProjects(
    filters: Project,
    pagination: IPaginationDTO,
    order: IOrderDTO,
    companyId?: string,
    companyType?: CompanyType,
    statusIn?: string[],
    userId?: string,
    accessType?: controller.UserCollaborationType
  ) {
    try {
      const {
        parentProject,
        startDate,
        expectedStartDate,
        expectedEndDate,
        endDate,
        title,
        archived,
        id,
        ...rest
      } = filters;
      const { limit = 10, page = 1 } = pagination ?? {};
      const currentTenantId = await this.reqContextResolutionService.getTenantId();
      const filtersSearch = {
        ...rest,
        ...(id && { id }),
        ...(parentProject && { id: parentProject }),
        ...(startDate && { startDate: MoreThanOrEqual(startDate) }),
        ...(expectedStartDate && {
          expectedStartDate: MoreThanOrEqual(expectedStartDate)
        }),
        ...(endDate && { endDate: LessThanOrEqual(endDate) }),
        ...(expectedEndDate && {
          expectedEndDate: LessThanOrEqual(expectedEndDate)
        }),
        ...(title && { title: Like(`%${title}%`) }),
        deleted: false
      };
      return await this.tenantEntityManager.transaction(async transactionalEntityManager => {
        const query = transactionalEntityManager
          .createQueryBuilder(Project, 'project')
          .loadAllRelationIds({
            relations: ['continuationOfProject', 'parentProject', 'subProjects', 'projectCollaboration']
          })
          .leftJoinAndSelect('project.projectCompany', 'projectCompany')
          .leftJoinAndSelect('projectCompany.evaluations', 'evaluation')
          .leftJoinAndSelect('project.collaborations', 'projectCollaboration')
          .where(filtersSearch)
          .orderBy('evaluation.created', 'DESC');

        if (statusIn?.length) {
          query.andWhere('project.status IN (:...statusIn)', { statusIn });
        }
        if (typeof companyId !== 'undefined') {
          query.andWhere('projectCompany.companyId=:id', { id: companyId });
        }
        if (typeof companyType !== 'undefined') {
          query.andWhere('projectCompany.type=:type', { type: companyType });
        }

        if (typeof accessType !== 'undefined') {
          const userTypeSwitch = {
            [controller.UserCollaborationType.OWNER]: UserType.OWNER,
            [controller.UserCollaborationType.COLLABORATOR]: UserType.COLLABORATOR,
            [controller.UserCollaborationType.VIEWER]: UserType.VIEWER
          };
          const userType = userTypeSwitch[accessType];

          userType && query.andWhere('projectCollaboration.userType=:userType', { userType });
        }
        if (userId && !companyId) {
          const user = await this.userRepository.findOneOrFail({
            where: {
              externalAuthSystemId: userId
            }
          });

          query.andWhere(
            new Brackets(qb => {
              qb.andWhere('projectCollaboration.userId =:userId', {
                userId: user.id
              });
              qb.andWhere('projectCollaboration.status =:status', {
                status: CollaborationStatus.ACCEPT
              });
              if (archived || id) qb.orWhere('project.archived=:archived', { archived: 1 });
            })
          );
        }

        if (!id) {
          if (archived) query.andWhere('project.archived=:archived', { archived: 1 });
          if (archived === false) query.andWhere('project.archived=:archived', { archived: 0 });
        }

        // pagination
        if (limit > 0) {
          query.take(limit).skip(limit * (page - 1));
        }

        // order
        if (order) {
          const { key, direction } = order;
          query.orderBy(key, direction);
        }

        const [results, count] = await query.getManyAndCount();

        const companiesMap = new Map();

        for (const project of results) {
          if (project.projectCompany && project.projectCompany.length) {
            project['scoreProject'] = this.findScoreProject(project, companyId);
            for (const projectCompany of project.projectCompany) {
              if (!companiesMap.has(projectCompany.companyId)) {
                companiesMap.set(projectCompany.companyId, [projectCompany]);
              } else {
                const projectCompanies = companiesMap.get(projectCompany.companyId);
                projectCompanies.push(projectCompany);
                companiesMap.set(projectCompany.companyId, projectCompanies);
              }
            }
          }
        }

        const companies = await this.companyRepository.findByIds([...companiesMap.keys()], {
          relations: ['tenantCompanyRelationships']
        });

        if (companiesMap.size === 0) return [results, count];

        for (const company of companies) {
          const projectCompanies = companiesMap.get(company.id);
          for (const projectCompany of projectCompanies) {
            company.tenantCompanyRelation = company?.tenantCompanyRelationships?.
              find(({ tenant: { id: tenantId } }) => tenantId === currentTenantId);
            projectCompany.company = company;
          }
        }

        if (id && results.length === 1) {
          const tenantId = await this.reqContextResolutionService.getTenantId();
          const [treeProject] = await this.globalProjectService.findByProjectId(id, tenantId);
          if (treeProject) results[0]['treeProjectId'] = treeProject?.id;
        }

        return [results, count];
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  findScoreProject(project: Project, companyId: string) {
    const { projectCompany } = project;
    if (projectCompany && projectCompany.length) {
      const projectCompanyFiltered = projectCompany.find(({ companyId: id }) => id === companyId);
      if (projectCompanyFiltered) {
        const scoreProject = projectCompanyFiltered?.evaluations?.sort((a, b) => b.created > a.created ? 1 : -1)[0]?.scoreValue;
        return scoreProject ? scoreProject : 0;
      }
    }
    return 0;
  }

  async getProjectCompanies(data: controller.CompanyProjectsPayload) {
    try {
      const { projectId, ...filters } = data;
      const tenantId = this.reqContextResolutionService.getTenantId();
      const [projectCompaniesResult, count] = await this.projectCompanyRepository.findAndCount({
        relations: ['project', 'evaluations'],
        where: { ...filters, ...(projectId && { project: projectId }) }
      });
      const companiesMap = new Map();

      for (const projectCompany of projectCompaniesResult) {
        if (companiesMap.has(projectCompany.companyId)) {
          const projectCompanies = companiesMap.get(projectCompany.companyId);
          projectCompanies.push(projectCompany);
          return companiesMap.set(projectCompany.companyId, projectCompanies);
        }
        companiesMap.set(projectCompany.companyId, [projectCompany]);
      }

      const companies = await this.companyRepository.findByIds([...companiesMap.keys()]);
      const relations = await this.tenantRelationService.getCompanyRelationByCompanyIds([...companiesMap.keys()]);
      defaultTCR.tenantId = tenantId;
      for (const company of companies) {
        const projectCompanies = companiesMap.get(company.id);
        for (const projectCompany of projectCompanies) {
          projectCompany.company = company;
          defaultTCR.companyId = company.id;
          projectCompany.company.tenantCompanyRelation =
            relations.find(relation => relation.company.id === company.id) || defaultTCR;
        }
      }

      return [projectCompaniesResult, count] as any;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSuppliersOfSuppliers(projectId: number, tenantId?: string) {
    if (!tenantId) tenantId = this.reqContextResolutionService.getTenantId();
    try {
      const [TreeProject] = await this.globalProjectRepository.find({
        where: {
          projectId,
          entityId: tenantId,
        },
        relations: ['subProjects']
      });

      let projectCompaniesToReturn = new Map<string, ProjectCompany[]>();
      const childProjectIdsMap = new Map<string, number[]>();

      if (!TreeProject?.subProjects) return projectCompaniesToReturn;
      const { subProjects: childProjects } = TreeProject;
      if (childProjects?.length) {
        for (const child of childProjects) {
          if (child.entityType === EntityProjectType.TENANT) {
            if (childProjectIdsMap.has(child.entityId))
              childProjectIdsMap.set(child.entityId, [...childProjectIdsMap.get(child.entityId), child.projectId]);
            else childProjectIdsMap.set(child.entityId, [child.projectId]);
          }
        }

        for (const [entityId, projectIds] of childProjectIdsMap) {
          const tenantConnection = await this.connectionProviderService.getTenantConnection(entityId);
          const projectCompaniesFromTenant = await tenantConnection.getRepository(ProjectCompany).find({
            where: {
              project: { id: In(projectIds) },
            },
            relations: ['evaluations']
          });
          const companiesMap = new Map();

          for (const projectCompany of projectCompaniesFromTenant) {
            if (!companiesMap.has(projectCompany.companyId))
              companiesMap.set(projectCompany.companyId, [projectCompany]);
            else {
              const projectCompanies = companiesMap.get(projectCompany.companyId);
              projectCompanies.push(projectCompany);
              companiesMap.set(projectCompany.companyId, projectCompanies);
            }
          }

          const companies = await this.companyRepository.findByIds([...companiesMap.keys()], {
            relations: ['tenantCompanyRelationships']
          });
          defaultTCR.tenantId = tenantId;
          for (const company of companies) {
            const projectCompanies = companiesMap.get(company.id);
            for (const projectCompany of projectCompanies) {
              defaultTCR.companyId = company.id;
              projectCompany.company = company;
              projectCompany.company.tenantCompanyRelation = company.tenantCompanyRelationships?.find(
                relation => relation.tenant.id === tenantId
              ) || defaultTCR;
            }
          }
          const client = projectCompaniesFromTenant.find(({ type }) => type === CompanyType.CLIENT);
          const supplier = projectCompaniesFromTenant.filter(({ type }) => type === CompanyType.AWARDED);
          if (client && supplier) {
            projectCompaniesToReturn.set(client.companyId, supplier);
          }

        }
        return projectCompaniesToReturn;
      }
      return projectCompaniesToReturn;
    } catch (error) {
      console.log(error);
      throw new GrpcUnavailableException(error);
    }
  }

  async getClientCompany() {
    const tenantId = this.reqContextResolutionService.getTenantId();
    const tenantCompany = await this.tenantCompanyRepository
      .findOneOrFail({
        where: { tenant: { id: tenantId } }
      })
      .catch(error => {
        throw new GrpcNotFoundException(error);
      });

    return this.companyRepository.findOne({
      where: { taxIdNo: tenantCompany.ein }
    });
  }

  async createProject(projectData: Project, companyId: string, type: CompanyType): Promise<Project> {
    const clientCompany = await this.getClientCompany();
    const { parentProjectTreeId } = projectData;

    if (parentProjectTreeId) {
      const SupplierId = await this.globalSupplierService.findSuppliersByProjectTreeIdAndCompanyId(
        parentProjectTreeId,
        clientCompany.id
      );
      if (!SupplierId)
        throw new GrpcNotFoundException('The company is not a supplier of the project used as a parent project.');
    }

    const project = await this.projectRepository.save({
      ...projectData,
      status: ProjectStatus.NEW
    });

    await this.evaluationService.createEvaluationTemplate(project, []);

    await this.projectCompanyRepository.save({
      companyId: clientCompany.id,
      project,
      type: CompanyType.CLIENT
    });
    if (companyId && type) {
      await this.projectCompanyRepository.save({
        companyId,
        project,
        type
      });
    }

    this.eventService.dispatchInternalEvent({
      code: EventCode.CREATE_PROJECT,
      data: project
    });

    await this.projectCollaborationService.sendProjectCollaboration(
      project,
      project.createdBy,
      UserTypeMapping[controller.UserCollaborationType.OWNER],
      CollaborationStatus.ACCEPT
    );
    this.userProfileService.subscribeToTopic({ projectIds: [`${project.id}`] });

    return project;
  }

  async answerProjectCriteria(projectId: number, companyId: string, answers: { criteria: string; answer: boolean }[]) {
    const projectCompany = await this.projectCompanyRepository.findOneOrFail({
      companyId,
      project: { id: projectId }
    });

    projectCompany.criteriaAnswers = answers;

    this.eventService.dispatchInternalEvent({
      code: EventCode.ANSWER_PROJECT_COMPANY_CRITERIA,
      data: { projectId, projectCompany, answers }
    });

    return this.projectCompanyRepository.save(projectCompany);
  }

  async addCompaniesToProject(projectId: number, companyIds: string[]) {
    const project = await this.projectRepository.findOneOrFail({
      where: { id: projectId },
      relations: ['collaborations']
    });

    if (!project.ongoing) {
      throw new GrpcUnavailableException('Project update unavailable. ongoing is set to false');
    }
    if (project.status === ProjectStatus.CANCELED) {
      throw new GrpcUnavailableException('Project update unavailable. project is canceled');
    }

    const companies = await this.companyRepository.find({
      where: { id: In(companyIds) },
      relations: ['tenantCompanyRelationships', 'tenantCompanyRelationships.tenant']
    });

    const tenantId = this.reqContextResolutionService.getTenantId();

    const newProjectCompaniesPromises = []; // factory promises array
    for (const company of companies) {
      let relation = company.tenantCompanyRelationships?.find(tcr => tcr.tenant.id === tenantId);

      if (!relation) {
        relation = await this.tenantRelationService.saveTenantCompanyRelation(tenantId, company, {
          supplierStatus: SupplierStatus.INACTIVE,
          supplierType: SupplierType.EXTERNAL
        });
      }
      let projectCompany = await this.projectCompanyRepository.findOne({
        companyId: company.id,
        project: { id: projectId }
      });

      if (!projectCompany) {
        // creating factory promises will allow this loop to finish his execution and checks.
        // Promises will start only if errors are not thrown from this loop
        newProjectCompaniesPromises.push(() =>
          this.projectCompanyRepository.save({
            companyId: company.id,
            type: CompanyType.CONSIDERED,
            project
          })
        );
      }

      const userIds = project.collaborations
        .filter(({ status }) => status === CollaborationStatus.ACCEPT)
        .map(({ userId }) => userId);

      from(this.userProfileService.subscribeAllUsersToTopic({ projectCompanyIds: [...companyIds] }, userIds)).subscribe(
        () =>
          this.eventService.dispatchInternalEvents([
            {
              code: EventCode.ADD_COMPANY_TO_PROJECT,
              data: {
                project,
                companyId: company.id,
                type: CompanyType.CONSIDERED
              }
            },
            {
              code: EventCode.UPDATE_PROJECT_COMPANIES,
              data: projectCompany ?? { project, companyId: company.id, type: CompanyType.CONSIDERED }
            }
          ])
      );
    }
    const relations = await Promise.all(newProjectCompaniesPromises.map(p => p()));
    // set coompany
    relations.map(relation => {
      relation.company = {
        id: relation.companyId
      };
    });

    const companyIdsMap = [...relations, ...project.projectCompany].map(({ companyId }) => companyId);
    const companiesInDb = await this.companyRepository.find({
      where: { id: In(companyIdsMap) }
    });
    // get company by each relation
    [...relations, ...project.projectCompany].map(relation => {
      relation.company = companiesInDb.find(company => company.id === relation.companyId);
    });

    return { ...project, projectCompany: [...(project.projectCompany ?? []), ...relations] } as Project;
  }

  async updateProjectCompany(projectId: number, companyId: string, type: CompanyType) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: ['tenantCompanyRelationships', 'tenantCompanyRelationships.tenant']
    });
    const tenantId = this.reqContextResolutionService.getTenantId();
    let relation = company.tenantCompanyRelationships?.find(tcr => tcr.tenant.id === tenantId);

    if (!relation) {
      relation = await this.tenantRelationService.saveTenantCompanyRelation(tenantId, company, {
        supplierStatus: type === CompanyType.CONSIDERED ? SupplierStatus.INACTIVE : SupplierStatus.ACTIVE,
        supplierType: type === CompanyType.CONSIDERED ? SupplierType.EXTERNAL : SupplierType.INTERNAL
      });
    }
    if (relation.type !== SupplierType.INTERNAL || relation.status !== SupplierStatus.ACTIVE) {
      relation = await this.tenantRelationService.updateTenantCompanyRelation(relation.id, {
        ...relation,
        isFavorite: relation.isFavorite ? relation.isFavorite : undefined,
        isToCompare: relation.isToCompare ? relation.isToCompare : undefined,
        type: SupplierType.INTERNAL,
        status: SupplierStatus.ACTIVE
      } as TenantCompanyRelationship);
      this.eventService.dispatchInternalEvents([
        {
          code: EventCode.UPDATE_COMPANY_TYPE,
          data: {
            company: { id: companyId },
            type: SupplierType.INTERNAL
          }
        },
        {
          code: EventCode.UPDATE_COMPANY_STATUS,
          data: { company, status: SupplierStatus.ACTIVE }
        }
      ]);
    }

    const project = await this.projectRepository.findOneOrFail({
      where: { id: projectId },
      relations: ['collaborations']
    });

    if (!project.ongoing) {
      throw new GrpcUnavailableException('Project update unavailable. ongoing is set to false');
    }
    if (project.status === ProjectStatus.CANCELED) {
      throw new GrpcUnavailableException('Project update unavailable. project is canceled');
    }

    const projectCompany = await this.projectCompanyRepository.findOne({
      companyId,
      project: { id: projectId }
    });

    const projectCompanyResponse = await this.projectCompanyRepository.save({
      companyId,
      project: { id: projectId },
      ...projectCompany,
      type
    });

    company.tenantCompanyRelation = company.tenantCompanyRelationships?.[0];
    projectCompanyResponse.company = company;

    const userIds = project.collaborations
      .filter(({ status }) => status === CollaborationStatus.ACCEPT)
      .map(({ userId }) => userId);

    from(this.userProfileService.subscribeAllUsersToTopic({ projectCompanyIds: [companyId] }, userIds)).subscribe(() =>
      this.eventService.dispatchInternalEvents([
        {
          code: EventCode.ADD_COMPANY_TO_PROJECT,
          data: projectCompanyResponse
        },
        {
          code: EventCode.UPDATE_PROJECT_COMPANIES,
          data: projectCompanyResponse
        }
      ])
    );

    return projectCompanyResponse;
  }

  async removeCompanyFromProject(projectId: number, companyId: string) {
    const project = await this.projectRepository.findOneOrFail({
      where: { id: projectId },
      relations: ['collaborations']
    });

    if (!project.ongoing) {
      throw new GrpcUnavailableException('Project update unavailable. ongoing is set to false');
    }
    if (project.status === ProjectStatus.CANCELED) {
      throw new GrpcUnavailableException('Project update unavailable. project is canceled');
    }

    const projectCompany = await this.projectCompanyRepository.findOneOrFail({
      companyId,
      project: { id: projectId }
    });

    await this.evaluationService.deleteCompanyEvaluation(projectCompany.id);

    const eventData = {
      ...projectCompany,
      project: { id: projectId },
      type: 'REMOVED'
    };
    from(
      this.eventService.dispatchInternalEvents([
        { code: EventCode.REMOVE_COMPANY_FROM_PROJECT, data: eventData },
        { code: EventCode.UPDATE_PROJECT_COMPANIES, data: eventData }
      ])
    ).subscribe(() => {
      const userIds = project.collaborations
        .filter(({ status }) => status === CollaborationStatus.ACCEPT)
        .map(({ userId }) => userId);
      this.userProfileService.unsubscribeAllUsersFromTopic({ projectCompanyIds: [companyId] }, userIds);
    });

    return this.projectCompanyRepository.delete(projectCompany);
  }

  async updateProject(_userId: string, projectData: Project): Promise<any> {
    const {
      status: newStatus,
      expectedStartDate,
      expectedEndDate,
      title,
      description,
      contract,
      keywords,
      budget
    } = projectData;
    const events: DispatchEventsDTO[] = [];
    const projectToUpdate = await this.projectRepository.preload({ id: projectData.id });

    if (!('ongoing' in projectData) && !projectToUpdate.ongoing) {
      throw new GrpcUnavailableException('Project update unavailable. ongoing is set to false');
    }
    if (projectToUpdate.status === ProjectStatus.CANCELED && !('archived' in projectData)) {
      throw new GrpcUnavailableException('Project update unavailable. project is canceled');
    }

    if (projectData?.archived && this.checkIfprojectCanBeArchived(projectToUpdate)) {
      throw new GrpcUnavailableException('Project cannot be archived. Needs to have completed on canceled status');
    }

    if (newStatus) {
      if (newStatus !== ProjectStatus.CANCELED) {
        const statuses = Object.keys(ProjectStatus);
        const currentStatusIndex = statuses.indexOf(projectToUpdate.status);
        if (statuses[currentStatusIndex + 1] !== newStatus) {
          throw new GrpcInvalidArgumentException(
            'Status argument is invalid. Projects cannot skip an intermediate status'
          );
        }
      }

      events.push({
        code: EventCode.UPDATE_PROJECT_STATUS,
        data: {
          ...projectToUpdate,
          status: newStatus
        }
      });
    }

    if (
      projectData?.archived &&
      projectToUpdate.archived === false &&
      !this.checkIfprojectCanBeArchived(projectToUpdate)
    ) {
      this.eventService.dispatchInternalEvent({
        code: EventCode.ARCHIVE_PROJECT,
        data: {
          ...projectToUpdate,
          archived: projectData.archived
        }
      });
    }
    if (typeof projectData?.ongoing !== 'undefined') {
      events.push({
        code: EventCode.PAUSE_PROJECT,
        data: projectToUpdate
      });
    }

    const projectInfoFields = { title, description, contract, keywords, budget };

    const updates = Object.keys(projectInfoFields).reduce(
      (acc: { id: string; from: string | Date; to: string | Date }[], curr: string) => {
        if (projectInfoFields[curr] && projectToUpdate[curr] !== projectInfoFields[curr]) {
          acc.push({ id: curr, from: projectToUpdate[curr], to: projectInfoFields[curr] });
        }
        return acc;
      },
      []
    );
    if (expectedStartDate && moment(expectedStartDate).diff(moment(projectToUpdate.expectedStartDate), 'days') !== 0) {
      updates.push({
        id: 'expectedStartDate',
        from: projectToUpdate.expectedStartDate,
        to: expectedStartDate
      });
    }
    if (expectedEndDate && moment(expectedEndDate).diff(moment(projectToUpdate.expectedEndDate), 'days') !== 0) {
      updates.push({
        id: 'expectedEndDate',
        from: projectToUpdate.expectedEndDate,
        to: expectedEndDate
      });
    }
    if (updates.length > 0) {
      events.push({
        code: EventCode.UPDATE_PROJECT_INFO,
        data: { project: projectToUpdate, updates }
      });
    }
    this.eventService.dispatchInternalEvents(events);

    let projectDataCloned = R.clone(projectData);
    projectDataCloned.expectedStartDate = undefined;
    projectDataCloned.expectedEndDate = undefined;

    const pred = R.whereEq(projectDataCloned);

    if (!pred(projectToUpdate) || updates.length > 0) {
      const response = this.projectRepository.save({ ...projectToUpdate, ...projectData });

      if (newStatus === ProjectStatus.COMPLETED) {
        const promiseArray = [];
        const awardedCompanies = projectToUpdate.projectCompany.filter(({ type }) => type === CompanyType.AWARDED);
        for (const company of awardedCompanies) {
          const { companyId, evaluations } = company;
          if (!!evaluations.length) {
            promiseArray.push(this.tenantRelationService.addEvaluationRelation(companyId));
            for (const evaluation of evaluations) {
              promiseArray.push(this.tenantRelationService.addRelationSpent(companyId, evaluation.budgetSpend));
            }
          }
        }
        await Promise.all(promiseArray);
      }
      if (newStatus === ProjectStatus.COMPLETED) {
        const promiseArray = [];
        const awardedCompanies = projectToUpdate.projectCompany.filter(({ type }) => type === CompanyType.AWARDED);
        for (const company of awardedCompanies) {
          const { companyId } = company;
          promiseArray.push(this.tenantRelationService.addProjectRelation(companyId));
        }
        await Promise.all(promiseArray);
      }

      return response;

    } else {
      return projectToUpdate;
    }
  }

  async cancelProject(id: number): Promise<Project> {
    const project = await this.projectRepository.preload({ id });

    if (!project) {
      throw new GrpcNotFoundException('Project not found!');
    }
    if (!project.ongoing) {
      throw new GrpcUnavailableException('Project update unavailable. ongoing is set to false');
    }
    const { status } = project;

    const statuses = Object.keys(ProjectStatus);
    const currentStatusIndex = statuses.indexOf(status);

    if (currentStatusIndex > -1 && currentStatusIndex < statuses.indexOf(ProjectStatus.COMPLETED)) {
      project.status = ProjectStatus.CANCELED;
      const updatedProject = await this.projectRepository.save(project);

      this.eventService.dispatchInternalEvent({
        code: EventCode.CANCEL_PROJECT,
        data: updatedProject
      });

      return updatedProject;
    } else {
      throw new GrpcInvalidArgumentException('The target project cannot be moved in cancel state!');
    }
  }

  async cloneProject(data: any): Promise<Project> {
    const { id, title, relation, includeDescription, includeSuppliers, includeNotes, includePeople, includeCriteria, people, userId,
      includeAttatchment, includeKeywords, includeBudget } = data;
    const projectToClone = await this.projectRepository.findOneOrFail(id);
    const { description, expectedStartDate, expectedEndDate, contract, selectionCriteria, budget, keywords } = projectToClone;

    const projectData: any = {
      createdBy: userId,
      title,
      expectedStartDate,
      expectedEndDate,
      contract,
      status: ProjectStatus.NEW,
      ...(includeDescription && { description }),
      ...(relation === CloningRelation.CONTINUATION && {
        continuationOfProject: projectToClone
      }),
      ...(relation === CloningRelation.SUBPROJECT && {
        parentProject: projectToClone
      }),
      ...(includeCriteria && { selectionCriteria }),
      ...(includeKeywords && { keywords }),
      ...(includeBudget && { budget }),
    };
    const clientCompany = await this.getClientCompany();

    const clonedProject = await this.tenantEntityManager.transaction(async transactionalEntityManager => {
      const newProject = await transactionalEntityManager.save(Project, { ...projectData });
      if (includeSuppliers) {
        await Promise.all(
          projectToClone.projectCompany.map(projectCompany => {
            return transactionalEntityManager.save(ProjectCompany, {
              companyId: projectCompany.companyId,
              project: newProject,
              type: projectCompany.type
            });
          })
        );
      } else {
        await transactionalEntityManager.save(ProjectCompany, {
          companyId: clientCompany.id,
          project: newProject,
          type: CompanyType.CLIENT
        });
      }

      if (includeAttatchment) {
        const attachments = await transactionalEntityManager.find(Attachment, {
          where: { project: projectToClone }
        });

        await Promise.all(
          attachments?.map(async attatchment => {
            const { filename, originalFilename, createdBy, url, size } = attatchment;
            return transactionalEntityManager.save(Attachment, {
              filename,
              originalFilename,
              createdBy,
              url,
              size,
              project: newProject
            });
          })
        );
      }

      if (includeNotes) {
        const notes = await transactionalEntityManager.find(ProjectNote, {
          relations: ['parentNote'],
          where: { project: projectToClone }
        });

        const [parentNotes, replies] = notes.reduce(
          (acc, curr) => {
            const index = curr.parentNote ? 1 : 0;
            acc[index].push(curr);

            return acc;
          },
          [[], []]
        );

        const savedNotes = await Promise.all(
          parentNotes?.map(async note => {
            const { body, createdBy } = note;
            return transactionalEntityManager.save(ProjectNote, {
              body,
              createdBy,
              project: newProject
            });
          })
        );

        await Promise.all(
          replies?.map(note => {
            const {
              parentNote: { id },
              body,
              createdBy
            } = note;
            const index = parentNotes.findIndex(note => id === note.id);
            const parentNote = savedNotes[index];

            return transactionalEntityManager.save(ProjectNote, {
              body,
              createdBy,
              project: newProject,
              parentNote
            });
          })
        );
      }

      return newProject as Project;
    });

    if (includePeople && !!people) {
      await Promise.all(
        people.map(async (collab: string) => {
          return this.projectCollaborationService.sendProjectCollaboration(
            clonedProject,
            collab,
            UserType.COLLABORATOR,
            CollaborationStatus.ACCEPT
          )
        })
      )
    }

    this.eventService.dispatchInternalEvent({
      code: EventCode.CREATE_PROJECT,
      data: clonedProject
    });
    this.userProfileService.subscribeToTopic({ projectIds: [`${clonedProject.id}`] });

    await this.projectCollaborationService.sendProjectCollaboration(
      clonedProject,
      clonedProject.createdBy,
      UserTypeMapping[controller.UserCollaborationType.OWNER],
      CollaborationStatus.ACCEPT
    );
    return clonedProject;
  }
  async markProjectAsDeleted(id: number) {
    const projectToDelete = await this.projectRepository.findOneOrFail(id);
    const updatedProject = await this.projectRepository.save({
      ...projectToDelete,
      deleted: true,
      continuationOfProject: null,
      parentProject: null
    });

    return { done: updatedProject.deleted };
  }

  async getProjectClassificatedByStatus(params: {
    filters: Project;
    companyId: string;
    userId?: string;
    types?: string[];
    status?: string[];
  }): Promise<ProjectStatusCountDTO> {
    const { filters, companyId, userId, types, status } = params;
    const { archived, deleted, ongoing } = filters;

    const queryBuilder = this.tenantEntityManager
      .createQueryBuilder(Project, 'project')
      .select('project.status', 'status')
      .addSelect('COUNT(project.id)', 'count')
      .leftJoin('project.projectCompany', 'projectCompany')
      .where('projectCompany.companyId = :companyId', { companyId });
    if (status?.length > 0) queryBuilder.andWhere('project.status IN (:...status)', { status });
    if (types.length > 0) queryBuilder.andWhere('projectCompany.type IN (:...types)', { types });
    if (deleted) queryBuilder.andWhere('project.deleted = :deleted', { deleted: deleted });
    if (archived) queryBuilder.andWhere('project.archived = :archived', { archived: archived });
    if (ongoing) queryBuilder.andWhere('project.ongoing = :ongoing', { ongoing: ongoing });
    queryBuilder.groupBy('project.status');

    if (userId) {
      queryBuilder.andWhere('project.createdBy = :userId', { userId });
    }

    const result = await queryBuilder.getRawMany();

    const projectStatusCountDTO = { results: {}, count: 0 } as ProjectStatusCountDTO;
    let countTotal = 0;

    for (const { status, count } of result) {
      projectStatusCountDTO.results[status] = count;
      countTotal += count;
    }
    projectStatusCountDTO.results.companyId = companyId;
    projectStatusCountDTO.count = countTotal;

    return projectStatusCountDTO;
  }
  async getCountProjectCompanyByCompanyId(
    companyId: string,
    status?: ProjectStatus[],
    types?: string[]
  ): Promise<ProjectCompanyCountDTO> {
    const queryBuilder = this.tenantEntityManager
      .createQueryBuilder(ProjectCompany, 'projectCompany')
      .leftJoin('projectCompany.project', 'project')
      .select('projectCompany.type', 'type')
      .addSelect('COUNT(projectCompany.id)', 'count')
      .where('projectCompany.companyId = :companyId', { companyId });
    if (types?.length > 0) queryBuilder.andWhere('projectCompany.type IN (:...types)', { types });
    if (status?.length > 0) queryBuilder.andWhere('project.status IN (:...status)', { status });

    queryBuilder.groupBy('projectCompany.type');

    const result = await queryBuilder.getRawMany();

    const projectCompanyCountDTO = { results: {}, count: 0 } as ProjectCompanyCountDTO;
    let countTotal = 0;
    for (const { type, count } of result) {
      projectCompanyCountDTO.results[type] = count;
      countTotal += count;
    }
    projectCompanyCountDTO.results.companyId = companyId;
    projectCompanyCountDTO.count = countTotal;

    return projectCompanyCountDTO;
  }

  // this method is used to delete all projectCompanies and evaluations related to a company
  async deleteProjectDataFromCompanyIdByTenantId(companies: string[], tenantConnection: Connection) {
    try {
      const projectCompanyRepository = tenantConnection.getRepository(ProjectCompany);

      const projectCompanies = await this.getAllProjectCompaniesByTenantId(companies, tenantConnection);

      projectCompanies.forEach(async projectCompany => {
        // TODO refactor
        if (projectCompany.evaluations?.length > 0) {
          return await this.evaluationService.deleteCompanyEvaluationByTenantId(projectCompany.id, tenantConnection);
        }
      });

      const projectCompaniesIds = projectCompanies.map(projectCompany => projectCompany.id);
      if (projectCompaniesIds.length > 0) {
        return projectCompanyRepository.delete({ id: In(projectCompaniesIds) });
      } else {
        this.logger.log(`No projectCompanies found for ${combineAll.length} companies`);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async deleteProjectDataFromCompaniesByTenantId(companies: string[], tenantConnection: Connection) {
    try {
      const projectCompanyRepository = tenantConnection.getRepository(ProjectCompany);

      const projectCompanies = await this.getAllProjectCompaniesByTenantId(companies, tenantConnection);

      projectCompanies.forEach(async projectCompany => {
        if (projectCompany.evaluations?.length > 0) {
          return await this.evaluationService.deleteCompanyEvaluationByTenantId(projectCompany.id, tenantConnection);
        }
      });

      const projectCompaniesIds = projectCompanies.map(projectCompany => projectCompany.id);
      if (projectCompaniesIds.length > 0) {
        return projectCompanyRepository.delete({ id: In(projectCompaniesIds) });
      } else {
        this.logger.log(`No projectCompanies found for ${companies.length} companies`);
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getAllProjectCompaniesByTenantId(companies: string[], tenantConnection: Connection): Promise<ProjectCompany[]> {
    const projectCompanyRepository = tenantConnection.getRepository(ProjectCompany);

    // find by companies
    const results = await projectCompanyRepository.find({
      where: {
        companyId: In(companies)
      }
    });

    return results;
  }

  async getProjectsDashboard(queryProjectsDashboard: controller.FiltersDashboardPayload) {
    const { timePeriodFilter, granularityFilter } = queryProjectsDashboard;

    const year = new Date().getFullYear();

    const query = this.tenantEntityManager
      .createQueryBuilder(Project, 'project')
      .select('MONTH(project.startDate) as date, count(*) as totalMonth');

    if (granularityFilter === 'month') {
      query
        .select('MONTH(project.startDate) as name, COUNT(*) as Projects')
        .groupBy('MONTH(project.startDate)')
        .orderBy('MONTH(project.startDate)');
    } else if (granularityFilter === 'quarter') {
      query
        .select('DATEPART(quarter, project.startDate) as name, COUNT(*) as Projects')
        .groupBy('DATEPART(quarter, project.startDate)')
        .orderBy('DATEPART(quarter, project.startDate)');
    }

    const checkPrevYear = await query.andWhere('YEAR(project.startDate)= :year', { year: year - 1 }).getCount();

    query.andWhere('YEAR(project.startDate)= :year', { year: timePeriodFilter === 'current' ? year : year - 1 });

    const count = await query.getCount();
    const projects = await query.execute();

    const results = projects.map(data => {
      return { ...data, name: granularityFilter === 'month' ? getMonthName(data.name) : 'Q' + data.name };
    });

    return [results, count, checkPrevYear];
  }

  async checkDataProjectDashboard() {
    const year = new Date().getFullYear();
    const query = this.tenantEntityManager
      .createQueryBuilder(Project, 'project')
    const currentYear = await query.where('YEAR(project.startDate)= :year', { year: year })
      .getCount();
    const prevYear = await query.where('YEAR(project.startDate)= :year', { year: year - 1 })
      .getCount();

    const hasData = (prevYear ?? currentYear) > 0 ? true : false;

    return [hasData, prevYear, currentYear];
  }
}
