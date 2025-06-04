import { controller } from 'controller-proto/codegen/tenant_pb';
import { IOrderDTO } from 'src/shared/order.interface';
import { Score } from 'src/stimulus-score/stimulus-score.entity';
import { TenantCompanyRelationship } from 'src/tenant-company-relationship/tenant-company-relationship.entity';
import { DeleteResult } from 'typeorm';
import { Company } from './company.entity';
import { CompanyNamesProvider } from 'src/company-names/company-names.provider';
export class CompanyProvider {
  public static buildCompany(id: string): Company {
    const company = new Company();
    company.id = id;
    company.created = new Date();
    company.updated = new Date();

    company.legalBusinessName = 'legalBusinessName_test';
    company.tenantCompanyRelation = new TenantCompanyRelationship();
    company.score = [];
    company.names = CompanyNamesProvider.buildCompanyNames(id);
    company.industries = [];

    company.tags = [
      {
        id: 'id',
        tag: 'tag',
        created: new Date(),
      },
    ] as any;
    return company;
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

  public static buildCompanyWithTenant(): Company {
    const company = new Company();
    company.tenantCompanyRelation = new TenantCompanyRelationship();
    return company;
  }

  public static buildCompanies(id: string): [Company] {
    return [this.buildCompany(id)];
  }

  public static buildDeleteResult(): DeleteResult {
    const deleteResult = new DeleteResult();
    deleteResult.affected = 1;
    return deleteResult;
  }

  public static buildQueryRequestPayload(): controller.QueryRequestPayload {
    const query = new controller.QueryRequestPayload();
    query.pagination = { limit: 20, page: 3 };
    query.order = this.buildOrder();
    return query;
  }

  public static buildSearchUnusedRequestPayload(): controller.SearchUnusedRequestPayload {
    const query = new controller.SearchUnusedRequestPayload();
    query.pagination = { limit: 20, page: 3 };
    query.order = this.buildOrder();
    return query;
  }

  public static buildOrder(): IOrderDTO {
    return { key: 'created', direction: 'DESC' };
  }

  public static buildSearchResponse(): any {
    return { result: { value: [{ id: 'id', tcr: new TenantCompanyRelationship() }], '@odata.count': 1 } };
  }
}
