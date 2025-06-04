import { Test, TestingModule } from '@nestjs/testing';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { UserTenantRoleService } from './user-tenant-role.service';

describe('UserTenantRoleService', () => {
  let service: UserTenantRoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTenantRoleService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
      ],
    }).compile();

    service = module.get<UserTenantRoleService>(UserTenantRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
