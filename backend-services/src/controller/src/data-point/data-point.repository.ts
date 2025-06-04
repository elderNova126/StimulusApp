import { DataPoint } from './data-point.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(DataPoint)
export class DataPointRepository extends Repository<DataPoint> {
  public async getLatestByCompaniesIdWithElementUntilDate(companyIds: string[], date?: Date) {
    const qb = this.createQueryBuilder('data_point')
      .innerJoin(
        (query) => {
          const latestQuery = query
            .from(DataPoint, 'data_point')
            .select('MAX(data_point.created)', 'data_point_created')
            .addSelect('data_point.companyId', 'data_point_companyId')
            .addSelect('data_point.element', 'data_point_element')
            .groupBy('data_point.element')
            .addGroupBy('data_point.companyId');
          if (date) {
            latestQuery.where('data_point.created <= :date', { date });
          }
          return latestQuery;
        },
        'data_points',
        `data_point.created = data_points.data_point_created 
          and data_point.companyId = data_points.data_point_companyId
          and data_point.element = data_points.data_point_element`
      )
      .where('data_point.companyId IN (:...companyIds)', { companyIds })
      .leftJoinAndSelect('data_point.element', 'element')
      .leftJoinAndSelect('data_point.company', 'company');

    return await qb.getMany();
  }
}
