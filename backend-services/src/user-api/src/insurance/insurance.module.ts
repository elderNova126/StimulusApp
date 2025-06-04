import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { InsuranceResolver } from './insurance.resolver';

@Module({
  providers: [InsuranceService, InsuranceResolver],
})
export class InsuranceModule {}
