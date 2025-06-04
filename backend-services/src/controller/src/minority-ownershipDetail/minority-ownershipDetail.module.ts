import { Module } from '@nestjs/common';
import { MinorityOwnershipDetailService } from './minority-ownershipDetail.service';

@Module({
  providers: [MinorityOwnershipDetailService],
  exports: [MinorityOwnershipDetailService],
})
export class MinorityOwnershipDetailModule {}
