import { Test, TestingModule } from '@nestjs/testing';
import { TenantService } from 'src/tenant/tenant.service';
import { AuthService } from './auth.service';
import { JWTService } from './bcrypt/jwt.service';
import { ExternalSystemService } from './ExternalSystem.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ExternalSystemService,
          useValue: {},
        },
        {
          provide: JWTService,
          useValue: {},
        },
        {
          provide: TenantService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
