import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';
import { Location } from './location.entity';
import { LocationService } from './location.service';

@Controller('location')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class LocationController {
  constructor(private locationService: LocationService) {}

  @GrpcMethod('DataService', 'SearchLocations')
  async searchLocations(data: any): Promise<{ results: Location[]; count: number }> {
    const { query, location: filters } = data;

    const [results, count] = await this.locationService.getLocations(filters, query);

    return { results, count };
  }

  @GrpcMethod('DataService', 'CreateLocation')
  async createLocation(data: any): Promise<Location> {
    const { dataTraceSource, userId, traceFrom, location } = data;
    return this.locationService.createLocation(location, { dataTraceSource, meta: { userId, method: traceFrom } });
  }

  @GrpcMethod('DataService', 'DeleteLocation')
  async deleteLocation(data: any): Promise<any> {
    const { id } = data;
    const res = await this.locationService.deleteLocation(id);

    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateLocation')
  async updateLocation(data: any): Promise<Location> {
    const { dataTraceSource, userId, traceFrom, location: locationData } = data;
    const { company, id, ...location } = locationData;

    if (company) {
      location.company = { id: company.id };
    }
    const res = await this.locationService.updateLocation(id, location, {
      dataTraceSource,
      meta: { userId, method: traceFrom },
    });

    return res;
  }
}
