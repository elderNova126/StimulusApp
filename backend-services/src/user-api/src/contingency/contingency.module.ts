import { Module } from '@nestjs/common';
import { ContingencyService } from './contingency.service';
import { ContingencyResolver } from './contingency.resolver';

@Module({
  providers: [ContingencyService, ContingencyResolver],
})
export class ContingencyModule {}
