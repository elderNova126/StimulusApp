import { Test, TestingModule } from '@nestjs/testing';
import { LoggingInterceptor } from 'src/logging/logger.interceptor';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { ProjectCollaborationAuthGuard } from 'src/project-collaboration/guards/project-collaboration.guard';
import { GrpcInvalidArgumentException } from 'src/shared/utils-grpc/exception';
import { ProjectController } from './project.controller';
import { ProjectProvider } from './project.provider';
import { ProjectService } from './project.service';

describe('Project Controller', () => {
  const project = ProjectProvider.buildProject('some-title');
  const projects = ProjectProvider.buildProjects('some-title');
  const projectCompany = ProjectProvider.buildProjectCompany(1, 'id-company');
  const projectCompanies = ProjectProvider.buildProjectCompanies(1, 'id-company');

  let controller: ProjectController;
  let service: ProjectService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [
        {
          provide: ProjectService,
          useValue: {
            getProjects: jest.fn().mockReturnValue(Promise.resolve([projects, 1])),
            getProjectCompanies: jest.fn().mockReturnValue(Promise.resolve([projectCompanies, 1])),
            createProject: jest.fn().mockReturnValue(Promise.resolve(project)),
            cancelProject: jest.fn().mockReturnValue(Promise.resolve(project)),
            cloneProject: jest.fn().mockReturnValue(Promise.resolve(project)),
            answerProjectCriteria: jest.fn().mockReturnValue(Promise.resolve(projectCompany)),
            updateProjectCompany: jest.fn().mockReturnValue(Promise.resolve(projectCompany)),
            addCompaniesToProject: jest.fn().mockReturnValue(Promise.resolve(project)),
            removeCompanyFromProject: jest.fn().mockReturnValue(Promise.resolve(ProjectProvider.buildDeleteResult())),
            updateProject: jest.fn().mockReturnValue(Promise.resolve(project)),
            markProjectAsDeleted: jest.fn().mockReturnValue(Promise.resolve({ done: true })),
          },
        },
        {
          provide: StimulusLogger,
          useValue: jest.fn(),
        },
      ],
    })
      .overrideGuard(ProjectCollaborationAuthGuard)
      .useValue(jest.fn())
      .overrideInterceptor(LoggingInterceptor)
      .useValue(jest.fn())
      .compile();

    controller = moduleRef.get<ProjectController>(ProjectController);
    service = moduleRef.get<ProjectService>(ProjectService);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it.skip('should search projects', async () => {
    const result = await controller.searchProjects({ projectPayload: {} });
    expect(result.results).toStrictEqual(projects);
    expect(result.count).toBe(1);
    expect(service.getProjects).toHaveBeenCalled();
  });

  it.skip('should search project companies', async () => {
    const searchRequest = ProjectProvider.buildCompanyProjectsPayload(1);
    const result = await controller.getProjectCompanies(searchRequest);
    expect(result.results).toStrictEqual(projectCompanies);
    expect(result.count).toBe(1);
    expect(service.getProjectCompanies).toHaveBeenCalled();
  });

  it.skip('should create project', async () => {
    const createRequest = { project: project, companyId: 'companyId', companyType: 'CLIENT' };
    const result = await controller.createProject(createRequest);
    expect(result).toStrictEqual(project);
    expect(service.createProject).toHaveBeenCalledWith(project, createRequest.companyId, createRequest.companyType);
  });

  it('should throw error when creating project', () => {
    const expectedError = new GrpcInvalidArgumentException('Missing create project arguments.');
    return expect(controller.createProject({})).rejects.toThrow(expectedError);
  });

  it.skip('should cancel project', async () => {
    const result = await controller.cancelProject({});
    expect(result).toStrictEqual(project);
    expect(service.cancelProject).toHaveBeenCalled();
  });

  it.skip('should clone project', async () => {
    const result = await controller.cloneProject({});
    expect(result).toStrictEqual(project);
    expect(service.cloneProject).toHaveBeenCalled();
  });

  it.skip('should answer project criteria', async () => {
    const result = await controller.answerProjectCriteria({ projectId: 1, companyId: 1, criteriaAnswers: [] });
    expect(result).toStrictEqual(projectCompany);
    expect(service.answerProjectCriteria).toHaveBeenCalledWith(1, 1, []);
  });

  it.skip('should update project company', async () => {
    const result = await controller.updateProjectCompany({ projectId: 1, companyId: 1, type: 'some-type' });
    expect(result).toStrictEqual(projectCompany);
    expect(service.updateProjectCompany).toHaveBeenCalledWith(1, 1, 'some-type');
  });

  it.skip('should add companies to project', async () => {
    const result = await controller.addCompaniesToProject({ projectId: 1, companyIds: [] });
    expect(result).toStrictEqual(project);
    expect(service.addCompaniesToProject).toHaveBeenCalledWith(1, []);
  });

  it.skip('should remove company from project', async () => {
    const result = await controller.removeCompanyFromProject({ projectId: 1, companyId: 1 });
    expect(result).toStrictEqual(ProjectProvider.buildDeleteResult());
    expect(service.removeCompanyFromProject).toHaveBeenCalledWith(1, 1);
  });

  it.skip('should update project', async () => {
    const result = await controller.updateProject({ userId: 1, projectPayload: { project: project } });
    expect(result).toStrictEqual(project);
    expect(service.updateProject).toHaveBeenCalledWith(1, project);
  });

  it.skip('should mark project as deleted', async () => {
    const result = await controller.markProjectAsDeleted({ id: 1 });
    expect(result.done).toBeTruthy();
  });
});
