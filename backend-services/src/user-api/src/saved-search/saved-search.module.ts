import { Module } from '@nestjs/common';
import { SavedSearchResolver } from './saved-search.resolver';
import { SavedSearchService } from './saved-search.service';

@Module({
  controllers: [],
  providers: [SavedSearchResolver, SavedSearchService],
})
export class SavedSearchModule {}
