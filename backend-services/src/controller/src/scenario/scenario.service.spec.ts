import { Test, TestingModule } from '@nestjs/testing';
import { TENANT_CONNECTION } from 'src/database/database.constants';
import { tenantConnectionMock } from 'test/typeormConnectionMock';
import { ScenarioService } from './scenario.service';

describe('ScenarioService', () => {
  let service: ScenarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScenarioService,
        {
          provide: TENANT_CONNECTION,
          useValue: tenantConnectionMock,
        },
      ],
    }).compile();

    service = await module.resolve<ScenarioService>(ScenarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
