import { Test, TestingModule } from '@nestjs/testing';
import { ContingencyResolver } from './contingency.resolver';

describe('ContingencyResolver', () => {
  let resolver: ContingencyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContingencyResolver],
    }).compile();

    resolver = module.get<ContingencyResolver>(ContingencyResolver);
  });

  it.skip('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
