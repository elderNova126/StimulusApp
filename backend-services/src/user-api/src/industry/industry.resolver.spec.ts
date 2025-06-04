import { Test, TestingModule } from '@nestjs/testing';
import { IndustryResolver } from './industry.resolver';

describe('IndustryResolver', () => {
  let resolver: IndustryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IndustryResolver],
    }).compile();

    resolver = module.get<IndustryResolver>(IndustryResolver);
  });

  it.skip('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
