import { ArgumentMetadata } from '@nestjs/common';
import { GrpcFailedPreconditionException } from 'src/shared/utils-grpc/exception';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { Company } from './company.entity';

describe('Company validation pipe', () => {
  let validationPipe: ValidationPipe;

  beforeEach(async () => {
    validationPipe = new ValidationPipe(Company);
  });

  it.skip('should validate empty company', async () => {
    const companyRequest = { company: new Company() };
    const result = await validationPipe.transform(companyRequest, { data: 'company' } as ArgumentMetadata);
    expect(result).toStrictEqual(companyRequest);
  });

  it.skip('should validate', async () => {
    const companyRequest = { company: new Company() };
    const company = new Company();
    company.taxIdNo = 'ZZ:32432';
    company.revenueGrowthCAGR = 0.89;
    company.customers = 24;
    company.website = 'www.google.com';
    company.webDomain = 'google.com';
    company.currency = 'USD';
    const result = await validationPipe.transform(companyRequest, { data: 'company' } as ArgumentMetadata);
    expect(result).toStrictEqual(companyRequest);
  });

  it('should throw error', async () => {
    const company = new Company();
    company.taxIdNo = 'ZZZ:32432';
    company.revenueGrowthCAGR = 1.1;
    company.customers = -24;
    company.website = 'google.com';
    company.webDomain = 'google';
    company.currency = 'dollar';
    const companyRequest = { company: company };
    await expect(validationPipe.transform(companyRequest, { data: 'company' } as ArgumentMetadata)).rejects.toThrow(
      new GrpcFailedPreconditionException(
        "The following fields don't respect validation criteria: taxIdNo,revenueGrowthCAGR,customers,webDomain,currency"
      )
    );
  });
});
