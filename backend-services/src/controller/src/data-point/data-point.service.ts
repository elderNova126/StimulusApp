import { Injectable, Inject } from '@nestjs/common';
import { DataPoint } from './data-point.entity';
import { DeleteResult, Like } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { DataPointRepository } from './data-point.repository';

@Injectable()
export class DataPointService {
  private readonly dataPointRepository: DataPointRepository;
  readonly searchFields = [];

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    protected readonly logger: StimulusLogger
  ) {
    this.dataPointRepository = connection.getCustomRepository(DataPointRepository);
    this.logger.context = DataPointService.name;
  }

  getDataPoints(filters: DataPoint, searchQuery: string): Promise<DataPoint[]> {
    let queryFilters: any = filters;

    if (searchQuery) {
      queryFilters = this.searchFields.map((item) => {
        return { ...queryFilters, [item]: Like(`%${searchQuery}%`) };
      });
    }

    return this.dataPointRepository.find({
      relations: ['company'],
      where: queryFilters,
    });
  }

  async createDataPoint(dataPointData: DataPoint): Promise<DataPoint> {
    return this.dataPointRepository.save(dataPointData);
  }

  async updateDataPoint(id: string, dataPointData: DataPoint): Promise<DataPoint> {
    await this.dataPointRepository.findOneOrFail({ where: { id } });

    return this.dataPointRepository.save({ ...dataPointData, id });
  }

  async deleteDataPoint(id: string): Promise<DeleteResult> {
    return this.dataPointRepository.delete(id);
  }
}
