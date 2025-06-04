import { Module } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CertificationResolver } from './certification.resolver';

@Module({
  providers: [CertificationService, CertificationResolver],
})
export class CertificationModule {}
