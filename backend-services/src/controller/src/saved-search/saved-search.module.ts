import { Module } from '@nestjs/common';
import { SavedSearchController } from './saved-search.controller';
import { SavedSearchService } from './saved-search.service';

@Module({
  controllers: [SavedSearchController],
  providers: [SavedSearchService],
})
export class SavedSearchModule {}
