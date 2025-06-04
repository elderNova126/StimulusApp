import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StimulusSearchService } from './stimulus-search.service';
import { SearchClientProviderService } from './search-client-provider.service';

@Controller('search')
export class SearchController {
  constructor(
    private stimulusSearchService: StimulusSearchService,
    private searchClientProviderService: SearchClientProviderService
  ) {}

  @GrpcMethod('NormalizerService', 'EndIngestion')
  async endIngestion(): Promise<any> {
    const statusCode = await this.stimulusSearchService.runCompanyAggregateIndexer();
    return { status: statusCode };
  }

  @GrpcMethod('DataService', 'UpdateAndReRunIndex')
  async updateAndReRunOnDemand(): Promise<any> {
    try {
      await this.searchClientProviderService.updateAndRunIndex();
      return { synchronized: 200, error: null };
    } catch (error) {
      return { synchronized: 500, error: error.message };
    }
  }
}
