import { Test, TestingModule } from '@nestjs/testing';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { DataPointService } from './data-point.service';

describe('DataPointService', () => {
  let service: DataPointService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataPointService,
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

    service = module.get<DataPointService>(DataPointService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
