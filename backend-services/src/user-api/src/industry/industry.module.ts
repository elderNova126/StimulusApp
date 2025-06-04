import { Module } from '@nestjs/common';
import { IndustryResolver } from './industry.resolver';
import { IndustryService } from './industry.service';

@Module({
  providers: [IndustryResolver, IndustryService],
})
export class IndustryModule {}
