import { Test, TestingModule } from '@nestjs/testing';
import { ScenarioResolver } from './scenario.resolver';

describe('ScenarioResolver', () => {
  let resolver: ScenarioResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScenarioResolver],
    }).compile();

    resolver = module.get<ScenarioResolver>(ScenarioResolver);
  });

  it.skip('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
