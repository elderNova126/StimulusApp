import { Test, TestingModule } from '@nestjs/testing';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { InternalEventService } from 'src/event/internal-event.service';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { CertificationService } from './certification.service';

describe('CertificationService', () => {
  let service: CertificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificationService,
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

    service = await module.resolve<CertificationService>(CertificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
