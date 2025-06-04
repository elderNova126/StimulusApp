import { Inject, Injectable, Scope } from '@nestjs/common';
import * as moment from 'moment';
import { Between, Connection, DeleteResult, LessThanOrEqual, Like, Repository } from 'typeorm';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { IOrder, IOrderDTO } from '../shared/order.interface';
import { IPagination, IPaginationDTO } from '../shared/pagination.interface';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';
import { Score } from './stimulus-score.entity';

@Injectable({ scope: Scope.REQUEST })
export class StimulusScoreService {
  private readonly stimulusScoreRepository: Repository<Score>;
  readonly searchFields = ['brandValue'];

  constructor(
    @Inject(GLOBAL_CONNECTION) connection: Connection,
    private readonly tenantCompanyRelationService: TenantCompanyRelationshipService
  ) {
    this.stimulusScoreRepository = connection.getRepository(Score);
  }

  public static buildDefaultScore(): Score {
    const score = new Score();
    score.scoreValue = 1000;
    score.brand = 1000;
    score.cost = 1000;
    score.diversity = 1000;
    score.features = 1000;
    score.financial = 1000;
    score.flexibility = 1000;
    score.innovation = 1000;
    score.reliability = 1000;
    score.quality = 1000;
    score.relationship = 1000;
    return score;
  }

  async getStimulusScores(
    filters: Score & { timestampFrom: string; timestampTo: string },
    searchQuery: string,
    pagination: IPaginationDTO,
    order: IOrderDTO
  ): Promise<any> {
    const { limit = 1, page = 1 } = pagination;
    const { key = 'timestamp', direction = 'DESC' } = order;
    const { timestampFrom, timestampTo, ...tail } = filters;
    let paginationParams: IPagination;
    let queryFilters: any = tail;

    if (searchQuery) {
      queryFilters = this.searchFields.map((item) => {
        return { ...queryFilters, [item]: Like(`%${searchQuery}%`) };
      });
    }

    if (timestampFrom) {
      if (limit === 1) {
        queryFilters.timestamp = LessThanOrEqual(timestampFrom);
      } else {
        const to = timestampTo || moment.utc().toISOString();
        queryFilters.timestamp = Between(timestampFrom, to);
      }
    }

    if (limit > 0) {
      paginationParams = {
        take: limit,
        skip: limit * (page - 1),
      };
    }

    const orderParams: IOrder = {
      [key]: direction,
    };

    return this.stimulusScoreRepository.findAndCount({
      relations: ['company'],
      where: queryFilters,
      order: orderParams,
      ...paginationParams,
    });
  }

  async createStimulusScore(stimulusScoreData: Score): Promise<Score> {
    const tenantCompany = await this.tenantCompanyRelationService.getTCRFromTenantContext(
      stimulusScoreData.company.internalId
    );

    stimulusScoreData.company = tenantCompany.company;
    return this.stimulusScoreRepository.save(stimulusScoreData);
  }

  async updateStimulusScore(id: string, stimulusScoreData: Score): Promise<Score> {
    await this.stimulusScoreRepository.findOneOrFail({
      relations: ['company'],
      where: { id },
    });

    return this.stimulusScoreRepository.save({ ...stimulusScoreData, id });
  }

  async deleteStimulusScore(id: number): Promise<DeleteResult> {
    return this.stimulusScoreRepository.delete(id);
  }
}
