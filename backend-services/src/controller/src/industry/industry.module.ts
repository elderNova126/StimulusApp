import { Module } from '@nestjs/common';
import { IndustryService } from './industry.service';
import { IndustryController } from './industry.controller';
import { IndustryStreamController } from './industry-stream.controller';
import { IndustryStreamService } from './industry-stream.service';
import { SEARCH_QUEUE } from '../search/search.constants';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: SEARCH_QUEUE,
    }),
  ],
  providers: [IndustryService, IndustryStreamService],
  controllers: [IndustryController, IndustryStreamController],
  exports: [IndustryService],
})
export class IndustryModule {}
