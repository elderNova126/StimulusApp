import { Scope } from '@nestjs/common';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import {
  GLOBAL_SEARCH_CLIENT,
  GLOBAL_SEARCH_CLIENT_PROVIDER,
  GLOBAL_COMPANY_AGGREGATE_INDEX_NAME,
  GLOBAL_COMPANY_AGGREGATE_INDEXER_NAME,
  GLOBAL_LOCATION_AGGREGATE_INDEX_NAME,
} from './search.constants';
import { StimulusSearchService } from './stimulus-search.service';
import { SearchClientProviderService } from './search-client-provider.service';
import { SearchProcessorService } from './search-processor.service';

export const searchProviders = [
  {
    provide: GLOBAL_SEARCH_CLIENT,
    scope: Scope.REQUEST,
    useFactory: async (serviceClientProviderService: SearchClientProviderService, logger: StimulusLogger) => {
      logger.debug(`Resolving global search client`);
      return serviceClientProviderService.getGlobalSearchClient();
    },
    inject: [GLOBAL_SEARCH_CLIENT_PROVIDER, StimulusLogger],
  },
  {
    provide: GLOBAL_COMPANY_AGGREGATE_INDEX_NAME,
    scope: Scope.REQUEST,
    useFactory: async (serviceClientProviderService: SearchClientProviderService, logger: StimulusLogger) => {
      logger.debug(`Resolving global company aggregate index name`);
      return serviceClientProviderService.getGlobalCompanyAggregateIndexName();
    },
    inject: [GLOBAL_SEARCH_CLIENT_PROVIDER, StimulusLogger],
  },
  {
    provide: GLOBAL_LOCATION_AGGREGATE_INDEX_NAME,
    scope: Scope.REQUEST,
    useFactory: async (serviceClientProviderService: SearchClientProviderService, logger: StimulusLogger) => {
      logger.debug(`Resolving global company locations aggregate index name`);
      return serviceClientProviderService.getGlobalCompanyLocationAggregateIndexName();
    },
    inject: [GLOBAL_SEARCH_CLIENT_PROVIDER, StimulusLogger],
  },
  {
    provide: GLOBAL_COMPANY_AGGREGATE_INDEXER_NAME,
    scope: Scope.REQUEST,
    useFactory: async (serviceClientProviderService: SearchClientProviderService, logger: StimulusLogger) => {
      logger.debug(`Resolving global company aggregate indexer name`);
      return serviceClientProviderService.getGlobalCompanyListAggregateIndexerName();
    },
    inject: [GLOBAL_SEARCH_CLIENT_PROVIDER, StimulusLogger],
  },
  {
    provide: GLOBAL_SEARCH_CLIENT_PROVIDER,
    scope: Scope.REQUEST,
    useExisting: SearchClientProviderService,
  },
  SearchClientProviderService,
  StimulusSearchService,
  SearchProcessorService,
];
