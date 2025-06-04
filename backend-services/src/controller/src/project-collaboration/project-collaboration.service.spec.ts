import { Test, TestingModule } from '@nestjs/testing';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from 'src/database/database.constants';
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { globalConnectionMock, tenantConnectionMock } from 'test/typeormConnectionMock';
import { ProjectCollaborationService } from './project-collaboration.service';

describe('ProjectCollaborationService', () => {
  let service: ProjectCollaborationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectCollaborationService,
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: UserProfileService,
          useValue: {},
        },
        {
          provide: ReqContextResolutionService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProjectCollaborationService>(ProjectCollaborationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
