import { Test, TestingModule } from '@nestjs/testing';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { InternalEventService } from 'src/event/internal-event.service';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { InsuranceService } from './insurance.service';

describe('InsuranceService', () => {
  let service: InsuranceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsuranceService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: ReqContextResolutionService,
          useValue: {},
        },
        {
          provide: InternalEventService,
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<InsuranceService>(InsuranceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
