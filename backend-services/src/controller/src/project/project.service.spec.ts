import { Test, TestingModule } from '@nestjs/testing';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { CompanyProvider } from 'src/company/company.provider';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from 'src/database/database.constants';
import { EvaluationService } from 'src/evaluation/evaluation.service';
import { EventCode } from 'src/event/event-code.enum';
import { InternalEventService } from 'src/event/internal-event.service';
import { GlobalSupplierService } from 'src/global-supplier/global-supplier.service';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { ProjectCollaborationService } from '../project-collaboration/project-collaboration.service';
import { GlobalProjectService } from '../project-tree/project-tree.service';
import {
  GrpcFailedPreconditionException,
  GrpcInvalidArgumentException,
  GrpcUnavailableException,
} from 'src/shared/utils-grpc/exception';
import {
  SupplierStatus,
  SupplierType,
  TenantCompanyRelationship,
} from 'src/tenant-company-relationship/tenant-company-relationship.entity';
import { TenantCompanyRelationshipService } from 'src/tenant-company-relationship/tenant-company-relationship.service';
import { TenantCompany } from 'src/tenant/tenant-company.entity';
import { Tenant } from 'src/tenant/tenant.entity';
import { TenantProvider } from 'src/tenant/tenant.provider';
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { User } from 'src/user/user.entity';
import {
  globalConnectionMock,
  tenantConnectionMock,
  repositoryMock,
  MockQueryBuilder,
} from 'test/typeormConnectionMock';
import { DeleteResult, EntityManager, Repository } from 'typeorm';
import { CompanyType, ProjectStatus } from './project.constants';
import { ProjectCompanyCountDTO, ProjectStatusCountDTO } from './project.dto';
import { Project } from './project.entity';
import { ProjectProvider } from './project.provider';
import { ProjectService } from './project.service';
import { GlobalProjectProvider } from '../project-tree/project-tree.provider';
import { ConnectionProviderService } from '../database/connection-provider.service';

describe('ProjectService', () => {
  let service: ProjectService | any;
  const tenantRepositoryMockHelper = jest.fn();
  const globalRepositoryMockHelper = jest.fn();
  let tenantConnection: Repository<any>;
  let globalConnection: Repository<any>;
  let evaluationService: EvaluationService;
  let projectCollaborationService: ProjectCollaborationService;
  let connectionProviderService: ConnectionProviderService;
  let userProfileService: UserProfileService;
  let internalEventService: InternalEventService;
  let tenantRelationshipService: TenantCompanyRelationshipService;
  let globalProjectService: GlobalProjectService;
  let globalSupplierService: GlobalSupplierService;

  const projects = ProjectProvider.buildProjects('some-title');
  const globalProjects = GlobalProjectProvider.buildGlobalProjects(1, 'tenantId');
  const globalProject = GlobalProjectProvider.buildGlobalProjects(1, 'tenantId')[0];
  const project = ProjectProvider.buildProject('test');
  const companies = CompanyProvider.buildCompanies('id-company');
  const company = CompanyProvider.buildCompany('id-company');
  const companyProjectsPayload = ProjectProvider.buildCompanyProjectsPayload(100);
  const projectCompanies = ProjectProvider.buildProjectCompanies(1, 'id-company');
  const tenantCompany = TenantProvider.buildTenantCompany();
  const user = new User();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
        {
          provide: InternalEventService,
          useValue: {
            dispatchInternalEvent: jest.fn(),
            dispatchInternalEvents: jest.fn().mockReturnValue(Promise.resolve()),
          },
        },
        {
          provide: ReqContextResolutionService,
          useValue: {
            getTenantId: jest.fn().mockReturnValue('tenantId'),
          },
        },
        {
          provide: UserProfileService,
          useValue: {
            subscribeToTopic: jest.fn(),
            subscribeAllUsersToTopic: jest.fn().mockReturnValue(Promise.resolve(user)),
            unsubscribeAllUsersFromTopic: jest.fn(),
          },
        },
        {
          provide: ProjectCollaborationService,
          useValue: {
            sendProjectCollaboration: jest.fn(),
          },
        },
        {
          provide: ConnectionProviderService,
          useValue: {
            getTenantConnection: jest.fn().mockReturnValue(tenantConnectionMock),
            getGlobalConnection: jest.fn().mockReturnValue(globalConnectionMock),
          },
        },
        {
          provide: EvaluationService,
          useValue: {
            createEvaluationTemplate: jest.fn(),
            deleteCompanyEvaluation: jest.fn(),
          },
        },
        {
          provide: TenantCompanyRelationshipService,
          useValue: {
            addProjectRelation: jest.fn(),
            getTenantCompanyRelationship: jest.fn(),
            getCompanyRelationByCompanyIds: jest.fn(),
          },
        },
        {
          provide: GlobalProjectService,
          useValue: {
            findByProjectId: jest.fn().mockReturnValue(globalProjects),
            getParentsProjectTreeFromSupplier: jest.fn().mockReturnValue([globalProjects, 1]),
          },
        },
        {
          provide: GlobalSupplierService,
          useValue: {
            findSuppliersByProjectTreeIdAndCompanyId: jest.fn(),
          },
        },
        {
          provide: StimulusLogger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();
    service = await module.resolve(ProjectService);
    tenantConnection = module.get<Repository<any>>(TENANT_CONNECTION);
    globalConnection = module.get<Repository<any>>(GLOBAL_CONNECTION);
    evaluationService = module.get<EvaluationService>(EvaluationService);
    projectCollaborationService = module.get<ProjectCollaborationService>(ProjectCollaborationService);
    userProfileService = module.get<UserProfileService>(UserProfileService);
    internalEventService = module.get<InternalEventService>(InternalEventService);
    tenantRelationshipService = module.get<TenantCompanyRelationshipService>(TenantCompanyRelationshipService);
    globalProjectService = module.get<GlobalProjectService>(GlobalProjectService);
    globalSupplierService = module.get<GlobalSupplierService>(GlobalSupplierService);
    connectionProviderService = module.get<ConnectionProviderService>(ConnectionProviderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get projects', async () => {
    service.projectRepository.findOneOrFail.mockReturnValueOnce(Promise.resolve(project));
    service?.companyRepository?.findByIds?.mockReturnValueOnce(Promise.resolve(companies));

    const mockQueryBuilder = {
      ...MockQueryBuilder,
      getManyAndCount: jest.fn().mockResolvedValue([projects, 1]),
    };

    const mockTransactionalEntityManager: Partial<EntityManager> = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder as any),
    };

    jest
      .spyOn(service.tenantEntityManager, 'transaction')
      .mockImplementation(async (callback: (transactionalEntityManager: EntityManager) => Promise<any>) => {
        // Call the callback with the mockTransactionalEntityManager
        return await callback(mockTransactionalEntityManager as EntityManager);
      });

    user.id = 'user-id';
    const result = await service.getProjects(
      project,

      { limit: 20, page: 3 },
      ProjectProvider.buildOrder(),
      null,
      CompanyType.CLIENT,
      [],
      null,
      controller.UserCollaborationType.OWNER
    );

    expect(result[0]).toStrictEqual(projects);
    expect(result[1]).toBe(1);

    expect(service.companyRepository.findByIds).toHaveBeenCalled();
    // verify leftJoinAndSelect
    const leftJoinAndSelectSpy = jest.spyOn(mockQueryBuilder, 'leftJoinAndSelect');

    expect(leftJoinAndSelectSpy).toHaveBeenCalledWith('project.projectCompany', 'projectCompany');
    expect(leftJoinAndSelectSpy).toHaveBeenCalledWith('projectCompany.evaluations', 'evaluation');
    expect(leftJoinAndSelectSpy).toHaveBeenCalledWith('project.collaborations', 'projectCollaboration');
    expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
    // is not called because we are not filtering by company
    expect(globalProjectService.findByProjectId).not.toHaveBeenCalled();
  });

  it('should get all other project', async () => {
    service?.globalProjectRepository?.createQueryBuilder?.mockReturnValueOnce({
      ...MockQueryBuilder,
      getMany: jest.fn().mockReturnValue(Promise.resolve([globalProject])),
    });
    service?.companyRepository.findOne?.mockReturnValue(Promise.resolve({ ...company, industries: ['industry_test'] }));
    service?.connectionProviderService?.getTenantConnection?.mockReturnValue({
      ...tenantConnectionMock,
      getRepository: jest.fn().mockReturnValue({
        ...repositoryMock,
        createQueryBuilder: jest.fn().mockReturnValue({
          ...MockQueryBuilder,
          getMany: jest.fn().mockReturnValue(Promise.resolve(projects)),
        }),
      }),
    });
    const result = await service.getAllOtherTierProjects(
      project,
      { limit: 20, page: 3 },
      ProjectProvider.buildOrder(),
      company.id,
      CompanyType.AWARDED,
      [ProjectStatus.INPROGRESS, ProjectStatus.COMPLETED],
      null
    );
    expect(result[0]).toStrictEqual(projects);
    expect(result[1]).toBe(1);

    expect(service.globalProjectRepository.createQueryBuilder).toHaveBeenCalled();
    expect(connectionProviderService.getTenantConnection).toHaveBeenCalled();
    expect(service.companyRepository.findOne).toHaveBeenCalled();
  });

  it('get All Supplier Tier Projects', async () => {
    service.globalProjectRepository?.createQueryBuilder?.mockReturnValueOnce({
      ...MockQueryBuilder,
      getMany: jest.fn().mockReturnValue(Promise.resolve(globalProjects)),
    });
    service.globalProjectRepository?.find?.mockReturnValueOnce(Promise.resolve(globalProjects));
    service.companyRepository?.findOneOrFail?.mockReturnValueOnce(Promise.resolve(company));
    service.connectionProviderService?.getTenantConnection?.mockReturnValue({
      ...tenantConnectionMock,
      getRepository: jest.fn().mockReturnValue({
        ...repositoryMock,
        createQueryBuilder: jest.fn().mockReturnValue({
          ...MockQueryBuilder,
          getMany: jest.fn().mockReturnValue(Promise.resolve(projects)),
        }),
      }),
    });

    const result = await service.getAllSupplierTierProjects(
      project,
      { limit: 20, page: 3 },
      ProjectProvider.buildOrder(),
      company.id,
      CompanyType.AWARDED,
      [ProjectStatus.INPROGRESS, ProjectStatus.COMPLETED],
      null
    );

    expect(result[0]).toStrictEqual(projects);
    expect(result[1]).toBe(1);

    expect(connectionProviderService.getTenantConnection).toHaveBeenCalled();
  });

  it('should get supplier of supplier', async () => {
    service?.globalProjectRepository?.find.mockReturnValueOnce(Promise.resolve(globalProjects));
    service?.companyRepository?.findByIds?.mockReturnValueOnce(Promise.resolve(companies));
    service?.tenantRelationService?.getCompanyRelationByCompanyIds?.mockReturnValueOnce(
      Promise.resolve([{ company: { id: 'company-id' }, id: 'relation-id' }])
    );
    service?.connectionProviderService?.getTenantConnection?.mockReturnValue({
      ...tenantConnectionMock,
      getRepository: jest.fn().mockReturnValue({
        ...repositoryMock,
        find: jest.fn().mockReturnValue(
          Promise.resolve([
            {
              ...projectCompanies[0],
              type: CompanyType.CLIENT,
            },
            {
              ...projectCompanies[0],
              companyId: 'supplier-Id',
              type: CompanyType.AWARDED,
            },
          ])
        ),
      }),
    });

    const result = await service.getSuppliersOfSuppliers(companyProjectsPayload);
    const expectedObj: Map<string, any> = new Map();
    expectedObj.set(companies[0].id, [{ ...projectCompanies[0], companyId: 'supplier-Id', type: 'AWARDED' }]);
    expect(result).toBeInstanceOf(Map);
    expect(result).toStrictEqual(expectedObj);

    expect(service.globalProjectRepository.find).toHaveBeenCalled();
    expect(service.companyRepository.findByIds).toHaveBeenCalled();
  });

  it('should get project companies', async () => {
    service?.projectCompanyRepository?.findAndCount?.mockReturnValueOnce(Promise.resolve([projectCompanies, 1]));
    service?.companyRepository?.findByIds?.mockReturnValueOnce(Promise.resolve(companies));
    service?.tenantRelationService?.getCompanyRelationByCompanyIds?.mockReturnValueOnce(Promise.resolve([]));

    const result = await service.getProjectCompanies(companyProjectsPayload);
    expect(result[0]).toStrictEqual(projectCompanies);
    expect(result[1]).toBe(1);

    expect(service.projectCompanyRepository.findAndCount).toHaveBeenCalled();
    expect(service.companyRepository.findByIds).toHaveBeenCalled();
    expect(service.tenantRelationService.getCompanyRelationByCompanyIds).toHaveBeenCalled();
  });

  it('should get client company', async () => {
    service?.tenantCompanyRepository?.findOneOrFail?.mockReturnValueOnce(Promise.resolve(tenantCompany));
    service?.companyRepository?.findOne?.mockReturnValueOnce(Promise.resolve(companies[0]));
    const result = await service.getClientCompany();
    const expectedObj = companies[0];

    expect(result).toStrictEqual(expectedObj);

    expect(service.tenantCompanyRepository.findOneOrFail).toHaveBeenCalled();
    expect(service.companyRepository.findOneOrFail).toHaveBeenCalled();
  });

  it.skip('should create project', async () => {
    const exapProject = { ...project, id: 1, status: ProjectStatus.NEW };
    tenantRepositoryMockHelper.mockReturnValue(Promise.resolve(exapProject));
    globalRepositoryMockHelper
      .mockReturnValueOnce(Promise.resolve(new TenantCompany()))
      .mockReturnValueOnce(Promise.resolve(companies[0]));

    expect(tenantConnection.save).toHaveBeenCalledWith(exapProject);
    expect(evaluationService.createEvaluationTemplate).toHaveBeenCalledWith(exapProject, []);
    expect(projectCollaborationService.sendProjectCollaboration).toHaveBeenCalled();
    expect(userProfileService.subscribeToTopic).toHaveBeenCalled();
    expect(globalSupplierService.findSuppliersByProjectTreeIdAndCompanyId).toHaveBeenCalled();
  });

  it.skip('should answer project criteria', async () => {
    tenantRepositoryMockHelper.mockReturnValueOnce(Promise.resolve(projectCompanies[0]));
    await service.answerProjectCriteria(1, 'id-company', [{ criteria: 'some-criteria', answer: true }]);
    expect(tenantConnection.findOneOrFail).toHaveBeenCalledWith({ companyId: 'id-company', project: { id: 1 } });
    expect(internalEventService.dispatchInternalEvent).toHaveBeenCalled();
    expect(tenantConnection.save).toHaveBeenCalledWith(projectCompanies[0]);
  });

  it.skip('should add companies to project', async () => {
    const tenant = new Tenant();
    tenant.id = 'tenantId';
    const tenantCompanyRelation = new TenantCompanyRelationship();
    tenantCompanyRelation.status = SupplierStatus.ACTIVE;
    tenantCompanyRelation.type = SupplierType.INTERNAL;
    tenantCompanyRelation.tenant = tenant;
    project.ongoing = true;
    companies[0].tenantCompanyRelationships = [tenantCompanyRelation];

    service.projectRepository.findOneOrFail.mockReturnValueOnce(Promise.resolve(project));
    service.companyRepository.find.mockReturnValueOnce(Promise.resolve(companies));
    service.projectCompanyRepository.findOne.mockReturnValueOnce(Promise.resolve(projectCompanies[0]));

    const result = await service.addCompaniesToProject(1, ['id-company']);
    expect(result.id).toStrictEqual(project.id);
    expect(result.title).toStrictEqual(project.title);
  });

  it.skip('should throw error when adding companies to project with ongoing set to false', async () => {
    const expectedError = new GrpcUnavailableException('Project update unavailable. ongoing is set to false');
    project.ongoing = false;
    tenantRepositoryMockHelper.mockReturnValueOnce(Promise.resolve(project));
    expect(() => service.addCompaniesToProject(1, ['id-company'])).toThrow(expectedError);
  });

  it.skip('should throw error when adding companies to project with status set to canceled', async () => {
    const expectedError = new GrpcUnavailableException('Project update unavailable. project is canceled');
    project.ongoing = true;
    project.status = ProjectStatus.CANCELED;
    tenantRepositoryMockHelper.mockReturnValueOnce(Promise.resolve(project));
    expect(() => service.addCompaniesToProject(1, ['id-company'])).toThrow(expectedError);
  });

  it.skip('should throw error when adding companies to project with no tenant relationship', async () => {
    const expectedError = new GrpcFailedPreconditionException(
      'Company needs to be internal active to proceed addCompanyToProject action'
    );
    project.ongoing = true;
    project.status = ProjectStatus.NEW;
    companies[0].tenantCompanyRelationships = [];
    tenantRepositoryMockHelper.mockReturnValueOnce(Promise.resolve(project));
    expect(() => service.addCompaniesToProject(1, ['id-company'])).toThrow(expectedError);
  });

  it.skip('should update project company', async () => {
    project.ongoing = true;
    const tenant = new Tenant();
    tenant.id = 'tenantId';
    const tenantCompanyRelation = new TenantCompanyRelationship();
    tenantCompanyRelation.status = SupplierStatus.ACTIVE;
    tenantCompanyRelation.type = SupplierType.INTERNAL;
    tenantCompanyRelation.tenant = tenant;
    companies[0].tenantCompanyRelationships = [tenantCompanyRelation];
    project.ongoing = true;
    project.collaborations = [];
    tenantRepositoryMockHelper
      .mockReturnValueOnce(Promise.resolve(project))
      .mockReturnValueOnce(Promise.resolve(projectCompanies[0]));
    const result = await service.updateProjectCompany(1, 'id-company', CompanyType.CLIENT);
    expect(result).toStrictEqual(projectCompanies[0]);
    expect(globalConnection.findOne).toHaveBeenCalledWith({
      where: { id: 'id-company' },
      relations: ['tenantCompanyRelationships', 'tenantCompanyRelationships.tenant'],
    });
    expect(tenantConnection.findOneOrFail).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['collaborations'],
    });
    expect(tenantConnection.findOne).toHaveBeenCalledWith({
      companyId: 'id-company',
      project: { id: 1 },
    });
  });

  it.skip('should throw error when updating project company with ongoing set to false', async () => {
    const expectedError = new GrpcUnavailableException('Project update unavailable. ongoing is set to false');
    project.ongoing = false;
    tenantRepositoryMockHelper.mockReturnValueOnce(Promise.resolve(project));
    expect(() => service.updateProjectCompany(1, 'id-company', CompanyType.CLIENT)).toThrow(expectedError);
  });

  it.skip('should throw error when updating project company with status set to canceled (update)', async () => {
    const expectedError = new GrpcUnavailableException('Project update unavailable. project is canceled');
    project.ongoing = true;
    project.status = ProjectStatus.CANCELED;
    tenantRepositoryMockHelper.mockReturnValueOnce(Promise.resolve(project));
    expect(() => service.updateProjectCompany(1, 'id-company', CompanyType.CLIENT)).toThrow(expectedError);
  });

  it.skip('should throw error when updating project company with no tenant relationship', async () => {
    const expectedError = new GrpcFailedPreconditionException(
      'Company needs to be internal active to proceed addCompanyToProject action'
    );
    project.ongoing = true;
    project.status = ProjectStatus.NEW;
    companies[0].tenantCompanyRelationships = [];
    tenantRepositoryMockHelper.mockReturnValueOnce(Promise.resolve(project));
    expect(() => service.updateProjectCompany(1, 'id-company', CompanyType.CLIENT)).toThrow(expectedError);
  });

  it.skip('should remove company from project', async () => {
    tenantRepositoryMockHelper
      .mockReturnValueOnce(Promise.resolve(project))
      .mockReturnValueOnce(Promise.resolve(projectCompanies[0]));
    const result = await service.removeCompanyFromProject(1, 'id-company');
    expect(tenantConnection.findOneOrFail).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: ['collaborations'],
    });
    expect(evaluationService.deleteCompanyEvaluation).toHaveBeenCalledWith(1);
    expect(result).toStrictEqual(new DeleteResult());
  });

  it.skip('should throw error when removing company from project with ongoing set to false', async () => {
    const expectedError = new GrpcUnavailableException('Project update unavailable. ongoing is set to false');
    project.ongoing = false;
    tenantRepositoryMockHelper.mockReturnValueOnce(Promise.resolve(project));
    expect(() => service.removeCompanyFromProject(1, 'id-company')).toThrow(expectedError);
  });

  it.skip('should throw error when updating project company with status set to canceled', async () => {
    const expectedError = new GrpcUnavailableException('Project update unavailable. project is canceled');
    project.ongoing = true;
    project.status = ProjectStatus.CANCELED;
    tenantRepositoryMockHelper.mockReturnValueOnce(Promise.resolve(project));
    expect(() => service.removeCompanyFromProject(1, 'id-company')).toThrow(expectedError);
  });

  it.skip('should update project', async () => {
    const projectCompany = ProjectProvider.buildProjectCompany(1, 'id-company');
    projectCompany.type = CompanyType.AWARDED;
    project.status = ProjectStatus.INPROGRESS;
    project.projectCompany = [projectCompany];
    const projectToUpdate = ProjectProvider.buildProject('some-title');
    projectToUpdate.status = ProjectStatus.COMPLETED;
    projectToUpdate.archived = false;
    projectToUpdate.expectedStartDate = new Date();
    const result = await service.updateProject('userId', projectToUpdate);
    expect(result).toStrictEqual(project);
    expect(tenantRelationshipService.addProjectRelation).toHaveBeenCalledWith('id-company');
    expect(internalEventService.dispatchInternalEvent).toHaveBeenCalledWith({
      code: EventCode.UPDATE_PROJECT_STATUS,
      data: {
        ...project,
        status: ProjectStatus.COMPLETED,
      },
    });
  });

  it.skip('should throw error when updating project with ongoing set to false', async () => {
    const expectedError = new GrpcUnavailableException('Project update unavailable. ongoing is set to false');
    const projectToUpdate = ProjectProvider.buildProject('some-title');
    project.ongoing = false;
    expect(() => service.updateProject('userId', projectToUpdate)).toThrow(expectedError);
  });

  it.skip('should throw error when updating project with status canceled', async () => {
    const expectedError = new GrpcUnavailableException('Project update unavailable. project is canceled');
    const projectToUpdate = ProjectProvider.buildProject('some-title');
    project.ongoing = true;
    project.status = ProjectStatus.CANCELED;
    expect(() => service.updateProject('userId', projectToUpdate)).toThrow(expectedError);
  });

  it.skip('should throw error when updating IN PROGRESS project with archive set to true', async () => {
    const expectedError = new GrpcUnavailableException(
      'Project cannot be archived. Needs to have completed on canceled status'
    );
    const projectToUpdate = ProjectProvider.buildProject('some-title');
    projectToUpdate.archived = true;
    project.ongoing = true;
    project.status = ProjectStatus.INPROGRESS;
    expect(() => service.updateProject('userId', projectToUpdate)).toThrow(expectedError);
  });

  it.skip('should throw error when updating project and skipping intermediate status', async () => {
    const expectedError = new GrpcInvalidArgumentException(
      'Status argument is invalid. Projects cannot skip an intermediate status'
    );
    const projectToUpdate = ProjectProvider.buildProject('some-title');
    projectToUpdate.status = ProjectStatus.NEW;
    project.ongoing = true;
    project.status = ProjectStatus.COMPLETED;
    expect(() => service.updateProject('userId', projectToUpdate)).toThrow(expectedError);
  });

  it.skip('should cancel project', async () => {
    project.status = ProjectStatus.INPROGRESS;
    const result = await service.cancelProject(1);
    expect(internalEventService.dispatchInternalEvent).toHaveBeenCalledWith({
      code: EventCode.CANCEL_PROJECT,
      data: project,
    });
    expect(result.status).toBe(ProjectStatus.CANCELED);
  });

  it.skip('should throw error when canceling project with ongoing set to false', async () => {
    const expectedError = new GrpcUnavailableException('Project update unavailable. ongoing is set to false');
    project.ongoing = false;
    expect(() => service.cancelProject(1)).toThrow(expectedError);
  });

  it.skip('should throw error when canceling project with COMPLETED status', async () => {
    const expectedError = new GrpcInvalidArgumentException('The target project cannot be moved in cancel state!');
    project.status = ProjectStatus.COMPLETED;
    project.ongoing = true;
    expect(() => service.cancelProject(1)).toThrow(expectedError);
  });

  it.skip('should clone project', async () => {
    globalRepositoryMockHelper
      .mockReturnValueOnce(Promise.resolve(new TenantCompany()))
      .mockReturnValueOnce(Promise.resolve(companies[0]));
    const result = await service.cloneProject({
      id: project.id,
      title: project.title,
      includeDescription: true,
      userId: 1,
    });
    expect(result).toStrictEqual(project);
    expect(tenantConnection.findOneOrFail).toHaveBeenCalledWith(project.id);
    expect(internalEventService.dispatchInternalEvent).toHaveBeenCalledWith({
      code: EventCode.CREATE_PROJECT,
      data: project,
    });
    expect(userProfileService.subscribeToTopic).toHaveBeenCalledWith({ projectIds: ['1'] });
    expect(projectCollaborationService.sendProjectCollaboration).toHaveBeenCalled();
  });

  it.skip('should mark project as deleted', async () => {
    await service.markProjectAsDeleted(1);
    expect(tenantConnection.save).toHaveBeenCalledWith(project);
  });

  it.skip('Get all the type by one companyId', async () => {
    const result = await service.getCountProjectCompanyByCompanyId('65E01FB1-CC5E-EC11-94F6-0003FFD786C0');
    expect(result).toMatchObject(new ProjectCompanyCountDTO());
  });

  it.skip('Get all status of a project by one companyId', async () => {
    const result = await service.getProjectClassificatedByStatus({
      companyId: '65E01FB1-CC5E-EC11-94F6-0003FFD786C0',
      filters: {} as Project,
    });
    expect(result).toMatchObject(new ProjectStatusCountDTO());
  });
});
