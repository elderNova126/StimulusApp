import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { GlobalSupplierService } from 'src/global-supplier/global-supplier.service';
import { GlobalProjectService } from 'src/project-tree/project-tree.service';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { SupplierTierLogicService } from './supplier-tier-logic.service';
import { SUPPLIER_TIER_QUEUE } from './supplier-tier.constants';

describe('SupplierTierLogicService', () => {
  let service: SupplierTierLogicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierTierLogicService,
        {
          provide: getQueueToken(SUPPLIER_TIER_QUEUE),
          useValue: {
            add: jest.fn(),
          },
        },
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: GlobalSupplierService,
          useValue: {},
        },
        {
          provide: GlobalProjectService,
          useValue: {},
        },
        {
          provide: ReqContextResolutionService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SupplierTierLogicService>(SupplierTierLogicService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
