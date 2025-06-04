import { Injectable, Scope, Inject } from '@nestjs/common';
import { GLOBAL_SEARCH_CLIENT, GLOBAL_COMPANY_AGGREGATE_INDEXER_NAME } from './search.constants';
import { SearchService } from 'azure-search-client';
import { StimulusLogger } from '../logging/stimulus-logger.service';

@Injectable({ scope: Scope.REQUEST })
export class StimulusSearchService {
  constructor(
    @Inject(GLOBAL_SEARCH_CLIENT)
    private readonly globalSearchClient: SearchService,
    @Inject(GLOBAL_COMPANY_AGGREGATE_INDEXER_NAME)
    private readonly globalCompanyAggregateIndexerName: string,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = StimulusSearchService.name;
  }

  async runCompanyAggregateIndexer() {
    const result = await this.globalSearchClient.indexers.use(this.globalCompanyAggregateIndexerName).run({
      retry: 3,
    });
    this.logger.log(result);
    return result.statusCode;
  }
}
