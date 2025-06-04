import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { SavedSearchService } from './saved-search.service';
import { SavedSearch } from './saved-search.entity';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';

@Controller('savedSearch')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class SavedSearchController {
  constructor(private savedSearchService: SavedSearchService) {}

  @GrpcMethod('DataService', 'GetSavedSearches')
  async searchSavedSearchs(data: any): Promise<{ results: SavedSearch[]; count: number }> {
    const [results, count] = await this.savedSearchService.getSavedSearches(data);

    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateSavedSearch')
  async createSavedSearch(data: any): Promise<SavedSearch> {
    return this.savedSearchService.createSavedSearch(data.savedSearch);
  }

  @GrpcMethod('DataService', 'DeleteSavedSearch')
  async deleteSavedSearch(data: any): Promise<any> {
    const { id, userId } = data;
    const res = await this.savedSearchService.deleteSavedSearch(id, userId);

    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateSavedSearch')
  async updateSavedSearch(data: any): Promise<SavedSearch> {
    const { id, ...savedSearch } = data.savedSearch;
    return this.savedSearchService.updateSavedSearch(id, savedSearch);
  }
}
