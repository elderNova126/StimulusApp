import { Test, TestingModule } from '@nestjs/testing';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { InternalEventService } from 'src/event/internal-event.service';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
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
          useValue: {
            getUserId: jest.fn().mockReturnValue('user'),
            getTenantId: jest.fn().mockReturnValue('tenantId'),
          },
        },
        {
          provide: InternalEventService,
          useValue: {},
        },
      ],
    }).compile();

    service = await module.resolve<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
