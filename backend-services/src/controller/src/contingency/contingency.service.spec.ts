import { Test, TestingModule } from '@nestjs/testing';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { InternalEventService } from 'src/event/internal-event.service';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { ContingencyService } from './contingency.service';

describe('ContingencyService', () => {
  let service: ContingencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContingencyService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: StimulusLogger,
          useValue: {},
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

    service = module.get<ContingencyService>(ContingencyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
