import { Injectable, Scope, Inject } from '@nestjs/common';
import { Repository, Like, DeleteResult } from 'typeorm';
import { Product } from './product.entity';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { Company } from '../company/company.entity';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { DataTraceSource, DataTraceMeta } from 'src/core/datatrace.types';
import { TenantCompany } from '../tenant/tenant-company.entity';
import { ReqContextResolutionService } from '../core/req-context-resolution.service';
import { InternalEventService } from '../event/internal-event.service';
import { EventCode } from '../event/event-code.enum';

@Injectable({ scope: Scope.REQUEST })
export class ProductService {
  private readonly productRepository: Repository<Product>;
  private readonly companyRepository: Repository<Company>;
  private readonly tenantCompanyRepository: Repository<TenantCompany>;
  readonly searchFields = ['name', 'type'];

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    protected readonly logger: StimulusLogger,
    private readonly reqContextResolutionService: ReqContextResolutionService,
    private eventService: InternalEventService
  ) {
    this.productRepository = connection.getRepository(Product);
    this.tenantCompanyRepository = connection.getRepository(TenantCompany);
    this.companyRepository = connection.getRepository(Company);
  }

  getProducts(filters: Product, searchQuery: string) {
    let queryFilters: any = filters;

    if (searchQuery) {
      queryFilters = this.searchFields.map((item) => {
        return { ...queryFilters, [item]: Like(`%${searchQuery}%`) };
      });
    }

    return this.productRepository.findAndCount({
      relations: ['company'],
      where: queryFilters,
    });
  }

  async createProduct(
    productData: Product,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ): Promise<Product> {
    const {
      dataTraceSource: source,
      meta: { userId, method },
    } = options;
    const tenantId = this.reqContextResolutionService.getTenantId();

    const dataTraceSource =
      source ??
      ((await this.tenantCompanyRepository.findOne({ tenant: { id: tenantId } })).ein ===
      (await this.companyRepository.findOneOrFail({ id: productData.company?.id })).taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);

    const response = await this.productRepository.save({
      ...productData,
      dataTraceSource,
      dataTraceMeta: {
        tenantId,
        userId,
        method,
      },
    });
    this.eventService.dispatchInternalEvent({
      code: EventCode.CREATE_COMPANY_PRODUCT,
      data: { company: productData.company, product: response },
    });

    return response;
  }

  async updateProduct(
    id: string,
    productData: Product,
    options: { dataTraceSource: DataTraceSource; meta: DataTraceMeta }
  ): Promise<Product> {
    const productToUpdate = await this.productRepository.findOneOrFail({
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
      productToUpdate.company.taxIdNo
        ? DataTraceSource.SUPPLIER
        : DataTraceSource.BUYER);
    const updates = Object.keys(productData)
      .map((field) => {
        const oldFieldValue = productToUpdate[field];
        const newFieldValue = productData[field];
        if (oldFieldValue !== newFieldValue) {
          return {
            id: field,
            from: oldFieldValue,
            to: newFieldValue,
          };
        }
      })
      .filter((val) => val);

    const response = await this.productRepository.save({
      ...productData,
      dataTraceSource,
      dataTraceMeta: {
        tenantId,
        userId,
        method,
      },
      id,
    });

    if (updates.length) {
      this.eventService.dispatchInternalEvent({
        code: EventCode.UPDATE_COMPANY_PRODUCT,
        data: { company: productToUpdate.company, product: response, updates },
      });
    }
    return response;
  }

  async deleteProduct(id: string): Promise<DeleteResult> {
    return this.productRepository.delete(id);
  }
}
