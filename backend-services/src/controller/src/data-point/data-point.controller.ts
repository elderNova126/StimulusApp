import { Controller, UseInterceptors, UseFilters } from '@nestjs/common';
import { DataPointService } from './data-point.service';
import { GrpcMethod } from '@nestjs/microservices';
import { DataPoint } from './data-point.entity';
import { LoggingInterceptor } from '../logging/logger.interceptor';
import { GrpcExceptionFilter } from '../shared/utils-grpc/grpc-exception-filter';

@Controller('data-point')
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class DataPointController {
  constructor(private dataPointService: DataPointService) {}

  @GrpcMethod('DataService', 'SearchDataPoint')
  async searchDataPoint(data: any): Promise<{ results: DataPoint[] }> {
    const { query, dataPoint: filters } = data;

    return {
      results: await this.dataPointService.getDataPoints(filters, query),
    };
  }

  @GrpcMethod('DataService', 'CreateDataPoint')
  async createDataPoint(data: any): Promise<DataPoint> {
    return this.dataPointService.createDataPoint(data.dataPoint);
  }

  @GrpcMethod('DataService', 'DeleteDataPoint')
  async deleteDataPoint(data: any): Promise<any> {
    const { id } = data;
    const res = await this.dataPointService.deleteDataPoint(id);

    return { done: res.affected > 0 };
  }

  @GrpcMethod('DataService', 'UpdateDataPoint')
  updateDataPoint(data: any): Promise<DataPoint> {
    const { id, ...dataPoint } = data.dataPoint;

    return this.dataPointService.updateDataPoint(id, dataPoint);
  }
}
