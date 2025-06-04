import { Test, TestingModule } from '@nestjs/testing';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { GlobalSupplierService } from './global-supplier.service';

describe('GlobalSupplierService', () => {
  let service: GlobalSupplierService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalSupplierService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
      ],
    }).compile();

    service = module.get<GlobalSupplierService>(GlobalSupplierService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
