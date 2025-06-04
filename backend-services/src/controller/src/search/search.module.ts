import { Module, Global } from '@nestjs/common';
import { searchProviders } from './search.provider';
import { SearchController } from './search.controller';
import { BullModule } from '@nestjs/bull';
import { SEARCH_QUEUE } from './search.constants';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: SEARCH_QUEUE,
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
  ],
  providers: [...searchProviders],
  exports: [...searchProviders],
  controllers: [SearchController],
})
export class SearchModule {}
