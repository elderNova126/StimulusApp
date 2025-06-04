import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { TENANT_CONNECTION } from 'src/database/database.constants';
import { InternalEventService } from 'src/event/internal-event.service';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { GlobalProjectService } from 'src/project-tree/project-tree.service';
import { SCORE_QUEUE } from 'src/score-logic/score-job.constants';
import { ScoreLogicServiceV2 } from 'src/score-logic/score-logic.service.v2';
import { SupplierTierLogicService } from 'src/supplier-tier/supplier-tier-logic.service';
import { TenantCompanyRelationshipService } from 'src/tenant-company-relationship/tenant-company-relationship.service';
import { tenantConnectionMock } from 'test/typeormConnectionMock';
import { EvaluationService } from './evaluation.service';

describe('Evaluation Service', () => {
  let service: EvaluationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationService,
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
        {
          provide: getQueueToken(SCORE_QUEUE),
          useValue: {
            add: jest.fn(),
          },
        },
        {
          provide: InternalEventService,
          useValue: {
            dispatchInternalEvent: jest.fn(),
          },
        },
        {
          provide: TenantCompanyRelationshipService,
          useValue: {
            getCompanyRelationByCompanyId: jest.fn(),
            saveTenantCompanyRelation: jest.fn(),
            updateTenantCompanyRelation: jest.fn(),
          },
        },
        {
          provide: StimulusLogger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
          },
        },
        {
          provide: ScoreLogicServiceV2,
          useValue: {
            computeProjectScore: jest.fn(),
          },
        },
        {
          provide: SupplierTierLogicService,
          useValue: {},
        },
        {
          provide: GlobalProjectService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EvaluationService>(EvaluationService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.skip('Re-evaluation all company evaluation', async () => {
    // this funtion returns a promise boolean
    const res = await service.reEvaluationAllCompanyEvaluation();
    expect(res).toBe(true);
  });
});
