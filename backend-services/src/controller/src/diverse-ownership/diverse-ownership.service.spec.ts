import { Test, TestingModule } from '@nestjs/testing';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { DiverseOwnershipService } from './diverse-ownership.service';

describe('DiverseOwnershipService', () => {
  let service: DiverseOwnershipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiverseOwnershipService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
      ],
    }).compile();

    service = module.get<DiverseOwnershipService>(DiverseOwnershipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
