import { Test, TestingModule } from '@nestjs/testing';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { GLOBAL_CONNECTION, TENANT_CONNECTION } from 'src/database/database.constants';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { globalConnectionMock, tenantConnectionMock } from 'test/typeormConnectionMock';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
        {
          provide: ReqContextResolutionService,
          useValue: {},
        },
        {
          provide: StimulusLogger,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
