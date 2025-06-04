import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioService } from './scenario.service';

describe('ScenarioService', () => {
  let service: ScenarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScenarioService],
    }).compile();

    service = module.get<ScenarioService>(ScenarioService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
