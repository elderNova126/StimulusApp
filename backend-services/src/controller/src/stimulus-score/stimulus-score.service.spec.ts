import { Test, TestingModule } from '@nestjs/testing';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { TenantCompanyRelationshipService } from 'src/tenant-company-relationship/tenant-company-relationship.service';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { StimulusScoreService } from './stimulus-score.service';

describe('StimulusScoreService', () => {
  let service: StimulusScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StimulusScoreService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: TenantCompanyRelationshipService,
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<StimulusScoreService>(StimulusScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
