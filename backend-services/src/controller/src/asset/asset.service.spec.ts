import { Test, TestingModule } from '@nestjs/testing';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { AssetService } from './asset.service';

describe('AssetService', () => {
  let service: AssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
      ],
    }).compile();

    service = module.get<AssetService>(AssetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
