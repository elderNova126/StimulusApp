import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { CompanyDiscoveryResolver } from './discovery.resolver';
import { CompanyDiscoveryService } from './company-discovery.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 0,
    }),
  ],
  providers: [CompanyResolver, CompanyDiscoveryResolver, CompanyDiscoveryService, CompanyService],
})
export class CompanyModule {}
