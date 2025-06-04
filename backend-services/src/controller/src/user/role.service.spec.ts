import { Test, TestingModule } from '@nestjs/testing';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
