import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { SupplierTierLogicService } from './supplier-tier-logic.service';
import { GlobalSupplierModule } from '../global-supplier/global-supplier.module';
import { GlobalProjectModule } from '../project-tree/project-tree.module';
import { BullModule, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DATA_SET_SUPPLIER_TIER, SUPPLIER_TIER_QUEUE } from './supplier-tier.constants';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { EventModule } from '../event/event.module';
import { SupplierTierProcessorService } from './supplier-tier.processor.service';

@Module({
  imports: [
    GlobalSupplierModule,
    GlobalProjectModule,
    EventModule,
    BullModule.registerQueue({
      name: SUPPLIER_TIER_QUEUE,
    }),
  ],
  providers: [SupplierTierLogicService, SupplierTierProcessorService],
  exports: [SupplierTierLogicService],
})
export class SupplierTierModule implements OnApplicationBootstrap {
  constructor(
    @InjectQueue(SUPPLIER_TIER_QUEUE) private readonly supplierTierQueue: Queue,
    private readonly moduleRef: ModuleRef
  ) {}

  async onApplicationBootstrap() {
    if (process.env.SUPPLIER_TIER === 'false' || !process.env.SUPPLIER_TIER) {
      return;
    }
    const contextId = ContextIdFactory.create();
    const logger = await this.moduleRef.resolve(StimulusLogger, contextId, { strict: false });
    logger.context = SupplierTierModule.name;
    const job = await this.supplierTierQueue.add(
      DATA_SET_SUPPLIER_TIER,
      {},
      {
        repeat: { cron: '0  3 * * *' },
      }
    );
    logger.log(JSON.stringify(job));
  }
}
