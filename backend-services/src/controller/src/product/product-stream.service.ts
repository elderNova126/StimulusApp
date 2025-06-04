import { Injectable, Scope, Inject } from '@nestjs/common';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { Product } from './product.entity';
import { GLOBAL_CONNECTION } from '../database/database.constants';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { TenantCompanyRelationshipService } from '../tenant-company-relationship/tenant-company-relationship.service';

@Injectable({ scope: Scope.REQUEST })
export class ProductStreamService {
  private readonly productRepository: Repository<Product>;

  constructor(
    @Inject(GLOBAL_CONNECTION) connection,
    private readonly logger: StimulusLogger,
    private readonly tenantCompanyRelationService: TenantCompanyRelationshipService
  ) {
    this.productRepository = connection.getRepository(Product);
  }

  async createProducts(productsData: Product[]): Promise<any> {
    const errors = [];
    const pointsArray = [];

    for (const productData of productsData) {
      const tenantCompany = await this.tenantCompanyRelationService.getTCRFromTenantContext(
        productData.company.internalId
      );

      if (tenantCompany) {
        productData.company = tenantCompany.company;
        pointsArray.push(productData);
      } else errors.push(productData.internalId);
    }
    await this.productRepository
      .createQueryBuilder()
      .insert()
      .into(Product)
      .values(pointsArray)
      .execute()
      .catch(async (error) => {
        this.logger.log('Failed to add products using the bulk insert method. Move to for each approach.');
        this.logger.debug(`Error is : ${error}`);
        await Promise.all(
          productsData.map((product) => {
            return this.createProductWithCompany(product).catch((err) => {
              this.logger.error(`Failed to create product with error ${err}`);
              product.internalId && errors.push(product.internalId);
              return undefined;
            });
          })
        ).then((result) => {
          const errors = result.filter((element) => element === undefined).length;
          this.logger.error(`Failed to insert ${errors}/${productsData.length} products`);
        });
      });

    return { errors };
  }

  async createProductWithCompany(productData: Product) {
    const tenantCompany = await this.tenantCompanyRelationService.getTCRFromTenantContext(
      productData.company.internalId
    );
    productData.company = tenantCompany.company;
    return this.productRepository.save(productData);
  }

  async updateProductUsingInternalId(internalId: string, productData: Product): Promise<UpdateResult> {
    return this.productRepository.update({ internalId }, productData);
  }

  async deleteProductUsingInternalId(internalId: string): Promise<DeleteResult> {
    return this.productRepository.delete({ internalId });
  }
}
