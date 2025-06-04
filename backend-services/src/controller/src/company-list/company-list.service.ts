import { Inject, Injectable } from '@nestjs/common';
import { ConnectionProviderService } from 'src/database/connection-provider.service';
import { Connection, Repository } from 'typeorm';
import { TENANT_CONNECTION } from '../database/database.constants';
import { EventCode } from '../event/event-code.enum';
import { InternalEventService } from '../event/internal-event.service';
import { IOrderDTO } from '../shared/order.interface';
import { IPagination, IPaginationDTO } from '../shared/pagination.interface';
import { GrpcUnauthenticatedException } from '../shared/utils-grpc/exception';
import { Company } from './../company/company.entity';
import { GLOBAL_CONNECTION } from './../database/database.constants';
import { CompanyList } from './company-list.entity';

@Injectable()
export class CompanyListService {
  private readonly companyListRepository: Repository<CompanyList>;
  private readonly companyRepository: Repository<Company>;
  readonly searchFields = [];

  constructor(
    @Inject(TENANT_CONNECTION) connection,
    private eventService: InternalEventService,
    @Inject(GLOBAL_CONNECTION) globalConnection,
    private connectionProviderService: ConnectionProviderService
  ) {
    this.companyListRepository = connection.getRepository(CompanyList);
    this.companyRepository = globalConnection.getRepository(Company);
  }

  async getCompanyLists(filters: CompanyList, order: IOrderDTO, pagination: IPaginationDTO) {
    const { limit, page } = pagination ?? {};
    const { key = 'created', direction = 'asc' } = order ?? {};
    let paginationParams: IPagination;

    if (limit > 0) {
      paginationParams = {
        take: limit,
        skip: limit * (page - 1),
      };
    }
    const { ...restOfFilters }: any = filters;
    const queryFilters =
      'isPublic' in restOfFilters
        ? filters
        : [
            { isPublic: true, ...restOfFilters },
            { isPublic: false, ...filters },
          ];

    const [results, count] = await this.companyListRepository.findAndCount({
      order: {
        [key]: direction,
      },
      where: queryFilters,
      ...paginationParams,
    });

    return { results, count };
  }

  async getCompanyListsByTenant(tenantId: string, companyListId: string): Promise<CompanyList> {
    const tenantConnection = await this.connectionProviderService.getTenantConnection(tenantId);
    const companyListRepository = tenantConnection.getRepository(CompanyList);
    return companyListRepository.findOne({ where: { id: companyListId } });
  }

  createCompanyList(companyList: CompanyList): Promise<CompanyList> {
    return this.companyListRepository.save(companyList);
  }

  async cloneCompanyList(id: number, name: string, userId: string) {
    const companyListToClone = await this.companyListRepository.findOneOrFail({ where: { id } });
    const nameOfClonedList = name === companyListToClone.name ? `${companyListToClone.name} (copy)` : name;

    return this.companyListRepository.save({
      companies: companyListToClone.companies,
      createdBy: userId,
      name: nameOfClonedList,
    });
  }

  async updateCompanyList(
    id: number,
    updates: { isPublic?: boolean; name: string },
    userId: string
  ): Promise<CompanyList> {
    const companyListToUpdate = await this.companyListRepository.findOneOrFail({ where: { id } });

    if (!userId || companyListToUpdate.createdBy !== userId) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
    const { ...rest } = companyListToUpdate;
    return this.companyListRepository.save({ ...rest, ...updates });
  }

  async addToCompanyList(id: number, companyIds: string[], userId: string): Promise<CompanyList> {
    const companyListToUpdate = await this.companyListRepository.findOneOrFail({ where: { id } });

    if (!userId || companyListToUpdate.createdBy !== userId) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }
    if (!companyIds.length) {
      return companyListToUpdate;
    }

    const companies = await this.companyRepository
      .createQueryBuilder('company')
      .where('id IN (:...companyIds)', { companyIds })
      .getMany();

    companyListToUpdate.companies = [...(companyListToUpdate.companies || []), ...companies.map(({ id }) => id)];

    for (const companyId of companyIds) {
      this.eventService.dispatchInternalEvent({
        code: EventCode.ADD_TO_COMPANY_LIST,
        data: {
          listId: id,
          companyId,
        },
      });
    }
    const { ...rest } = companyListToUpdate;
    return this.companyListRepository.save(rest);
  }

  async removeFromCompanyList(data: {
    id: number;
    companyIds: string[];
    userId: string;
    tenantId: string;
  }): Promise<CompanyList> {
    const { id, companyIds, tenantId } = data;
    let companyListToUpdate = null;
    let differentRepository = null;

    if (tenantId) {
      const connection = await this.connectionProviderService.getTenantConnection(tenantId);
      differentRepository = connection.getRepository(CompanyList);
      companyListToUpdate = await differentRepository.findOneOrFail({ where: { id } });

      companyListToUpdate.companies = companyListToUpdate.companies.filter(
        (companyId) => !companyIds.find((target) => target === companyId)
      );

      for (const companyId of companyIds) {
        this.eventService.dispatchInternalEvent({
          code: EventCode.REMOVE_FROM_COMPANY_LIST,
          data: {
            listId: id,
            companyId,
          },
        });
      }

      const { ...rest } = companyListToUpdate;
      return differentRepository.save(rest);
    } else {
      companyListToUpdate = await this.companyListRepository.findOneOrFail({ where: { id } });

      companyListToUpdate.companies = companyListToUpdate.companies.filter(
        (companyId) => !companyIds.find((target) => target === companyId)
      );

      for (const companyId of companyIds) {
        this.eventService.dispatchInternalEvent({
          code: EventCode.REMOVE_FROM_COMPANY_LIST,
          data: {
            listId: id,
            companyId,
          },
        });
      }

      const { ...rest } = companyListToUpdate;
      return this.companyListRepository.save(rest);
    }
  }

  async deleteCompanyList(id: number, userId: string) {
    const companyListToDelete = await this.companyListRepository.findOne(id);

    if (companyListToDelete.createdBy !== userId) {
      throw new GrpcUnauthenticatedException('Insufficient permissions');
    }

    await this.companyListRepository.remove(companyListToDelete);
  }

  async removeCompanyFromAllCompanyListsByTenantId(companiesToDelete: string[], tenantConnection: Connection) {
    try {
      const companyListRepository = tenantConnection.getRepository(CompanyList);
      const companyListQueryBuilder = companyListRepository.createQueryBuilder('companyList');
      const companyLists = await companyListQueryBuilder.select();

      let t = 0;
      for (const companyToDelete of companiesToDelete) {
        companyLists.orWhere(`companyList.companies LIKE :${t}`, { [t]: `%${companyToDelete}%` });
        t++;
      }
      const companyListsResult = await companyListQueryBuilder.getMany();

      // split companies array by comma and remove company id different companies
      const updatedCompanyLists: any[] = companyListsResult.map((companyList: any) => {
        const companiesInCompanyList = companyList.companies.toString().split(',');

        // remove company id in companiesIdCompanyList array
        const companies = companiesInCompanyList.filter((company) => !companiesToDelete.includes(company));

        // concat companies array to string
        companyList.companies = companies.join(',');

        return {
          ...companyList,
          companies,
        };
      });
      if (updatedCompanyLists.length > 0) {
        await companyListRepository.save(updatedCompanyLists);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
