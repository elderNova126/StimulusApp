import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { DeleteResult, Like, Repository, Not, In, IsNull } from 'typeorm';
import { Company } from '../company/company.entity';
import { DataTraceMeta, DataTraceSource } from '../core/datatrace.types';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { StimulusJobData } from '../scheduler/stimulus-job-data.interface';
import { INDEXER_ON_DEMAND_JOB, SEARCH_QUEUE } from '../search/search.constants';
import { TenantCompany } from '../tenant/tenant-company.entity';
import { Industry } from './industry.entity';
import { GrpcInvalidArgumentException } from '../shared/utils-grpc/exception';
@Injectable()
export class IndustryService {
  private readonly industryRepository: Repository<Industry>;
  private readonly companyRepository: Repository<Company>;
  private readonly tenantCompanyRepository: Repository<TenantCompany>;
  readonly searchFields = [];

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    protected readonly logger: StimulusLogger,
    @InjectQueue(SEARCH_QUEUE) private searchQueue: Queue<StimulusJobData<any>>,
    private readonly reqContextResolutionService: ReqContextResolutionService
  ) {
    this.industryRepository = connection.getRepository(Industry);
    this.tenantCompanyRepository = connection.getRepository(TenantCompany);
    this.companyRepository = connection.getRepository(Company);
    this.logger.context = IndustryService.name;
  }

  async createIndustry(
    industryData: Industry,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ): Promise<Industry> {
    try {
      // clean data
      delete industryData.id;

      const {
        dataTraceSource: source,
        meta: { userId, method },
      } = options;
      const tenantId = this.reqContextResolutionService.getTenantId();
      let dataTraceSource = null;

      if (industryData.company) {
        dataTraceSource =
          source ??
          ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
          (await this.companyRepository.findOneOrFail({ id: industryData.company?.id })).taxIdNo
            ? DataTraceSource.SUPPLIER
            : DataTraceSource.BUYER);
      }

      const response = await this.industryRepository.save({
        ...industryData,
        dataTraceSource,
        dataTraceMeta: {
          tenantId,
          userId,
          method,
        },
      });
      return response;
    } catch (error) {
      this.logger.error(error);
      throw new GrpcInvalidArgumentException(`Error creating industry: ${error.message}`);
    }
  }

  async updateIndustry(
    id: string,
    industryData: Industry,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ): Promise<Industry> {
    const industryToUpdate = await this.industryRepository.findOneOrFail({
      relations: ['company'],
      where: { id },
    });

    const {
      dataTraceSource: source,
      meta: { userId, method },
    } = options;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
      industryToUpdate.company.taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);

    await this.industryRepository.update(
      { id },
      {
        ...industryData,
        dataTraceSource,
        dataTraceMeta: {
          tenantId,
          userId,
          method,
        },
      }
    );
    if ((await this.searchQueue.getWaitingCount()) < 1) await this.searchQueue.add(INDEXER_ON_DEMAND_JOB, {}, {});
    return this.industryRepository.findOne(id);
  }

  async deleteIndustry(id: string): Promise<DeleteResult> {
    return this.industryRepository.delete(id);
  }

  async getIndustries(
    filters: Industry,
    searchQuery: string,
    tenantId?: string
  ): Promise<{ results: Industry[]; count: number }> {
    if (!tenantId) tenantId = this.reqContextResolutionService.getTenantId();

    let queryFilters: any = filters ?? {};
    if (searchQuery) {
      queryFilters = this.searchFields.map((item) => {
        return { ...queryFilters, [item]: Like(`%${searchQuery}%`) };
      });
    }
    queryFilters = { ...queryFilters, code: Not(null) };
    try {
      const [standarIndustries, standarIndustriesCount] = await this.industryRepository.findAndCount({
        where: { code: Not(IsNull()) },
      });

      const [customIndustries, customIndustriesCount] = await this.industryRepository
        .createQueryBuilder('industry')
        .innerJoin('industry.tenant', 'tenant')
        .where('tenant.id = :tenantId', { tenantId })
        .getManyAndCount();

      const results = [...standarIndustries, ...customIndustries];
      const count = standarIndustriesCount + customIndustriesCount;

      return { results, count };
    } catch (error) {
      this.logger.error(error);
      throw new GrpcInvalidArgumentException(`Error getting industries: ${error.message}`);
    }
  }

  async getIndustriesByRange(start: string, _end: string) {
    const results = await this.industryRepository.find({
      where: { code: Like(`${start}%`) },
    });
    return results;
  }

  async joinCurrentTenantWithIndustry(industries: Industry[], tenantId: string) {
    const newIndustries = await this.industryRepository.find({
      where: { title: In(industries.map(({ title }) => title)), code: IsNull() },
      select: ['id'],
    });
    try {
      const update = await this.industryRepository
        .createQueryBuilder('industry')
        .relation('tenant', 'industries')
        .of(tenantId)
        .add(newIndustries.map(({ id }) => id));
      return update;
    } catch (error) {
      this.logger.error(error);
      throw new GrpcInvalidArgumentException(`Error joining tenant with industry: ${error.message}`);
    }
  }
  async getCompanyIndustriesByTenant(industriesIds: string[], tenantId?: string) {
    if (industriesIds.length === 0) return [];
    if (!tenantId) tenantId = this.reqContextResolutionService.getTenantId();

    try {
      const result = await this.industryRepository
        .createQueryBuilder('industry')
        .leftJoinAndSelect('industry.tenant', 'tenant')
        .where('industry.id IN (:...ids) AND (tenant.id = :tenantId OR industry.code IS NOT NULL)', {
          ids: industriesIds,
          tenantId,
        })
        .getMany();
      return result;
    } catch (error) {
      this.logger.error(error);
      throw new GrpcInvalidArgumentException(`Error getting industries by tenant: ${error.message}`);
    }
  }
}
