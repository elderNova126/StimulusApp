import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { SearchService } from 'azure-search-client';
import { Job } from 'bull';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { StimulusJobData } from '../scheduler/stimulus-job-data.interface';
import {
  GLOBAL_COMPANY_AGGREGATE_INDEXER_NAME,
  GLOBAL_SEARCH_CLIENT,
  INDEXER_ON_DEMAND_JOB,
  SEARCH_QUEUE,
} from './search.constants';

@Injectable()
@Processor(SEARCH_QUEUE)
export class SearchProcessorService {
  constructor(
    @Inject(GLOBAL_SEARCH_CLIENT)
    private readonly globalSearchClient: SearchService,
    @Inject(GLOBAL_COMPANY_AGGREGATE_INDEXER_NAME)
    private readonly globalCompanyAggregateIndexerName: string,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = SearchProcessorService.name;
  }

  @Process(INDEXER_ON_DEMAND_JOB)
  async runIndexer(_job: Job<StimulusJobData<any>>) {
    const result = await this.globalSearchClient.indexers.use(this.globalCompanyAggregateIndexerName).run({
      retry: 3,
    });
    this.logger.log(JSON.stringify(result, undefined, 2));
    return result.statusCode;
  }
}
