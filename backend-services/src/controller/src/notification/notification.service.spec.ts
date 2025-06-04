import { Test, TestingModule } from '@nestjs/testing';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from 'src/database/database.constants';
import { EventService } from 'src/event/event.service';
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { globalConnectionMock, tenantConnectionMock } from 'test/typeormConnectionMock';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
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
          provide: EventService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
