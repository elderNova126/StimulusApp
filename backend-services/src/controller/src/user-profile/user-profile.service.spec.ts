import { Test, TestingModule } from '@nestjs/testing';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from 'src/database/database.constants';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { globalConnectionMock, tenantConnectionMock } from 'test/typeormConnectionMock';
import { UserProfileService } from './user-profile.service';

describe('UserProfileService', () => {
  let service: UserProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProfileService,
        {
          provide: ReqContextResolutionService,
          useValue: {
            getUserId: jest.fn().mockReturnValue('user'),
            getTenantId: jest.fn().mockReturnValue('tenantId'),
          },
        },
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: StimulusLogger,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UserProfileService>(UserProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
