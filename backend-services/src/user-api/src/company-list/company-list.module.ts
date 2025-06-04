import { Module } from '@nestjs/common';
import { CompanyListService } from './company-list.service';
import { CompanyListResolver } from './company-list.resolver';

@Module({
  providers: [CompanyListService, CompanyListResolver],
  imports: [],
  exports: [],
})
export class CompanyListModule {}
