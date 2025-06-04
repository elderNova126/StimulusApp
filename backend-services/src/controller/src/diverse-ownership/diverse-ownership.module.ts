import { Module } from '@nestjs/common';
import { DiverseOwnershipService } from './diverse-ownership.service';

@Module({
  providers: [DiverseOwnershipService],
  exports: [DiverseOwnershipService],
})
export class DiverseOwnershipModule {}
