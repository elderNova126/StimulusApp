import { IOrderDTO } from 'src/shared/order.interface';
import { DeleteResult } from 'typeorm';
import { Industry } from './industry.entity';
import { Company } from 'src/company/company.entity';
import { Tenant } from 'src/tenant/tenant.entity';

export class industryProvider {
  static buildGlobalProjects(titles: string[], companyId: string, TenantId: string): Industry[] {
    return titles.map((title) => this.buildIndustry(title, companyId, TenantId));
  }

  static buildWithOutCompany(industries: Industry[]): Industry[] {
    return industries.map((industry) => {
      delete industry.company;
      return industry;
    });
  }

  static buildIndustry(title: string, companyId: string, TenantId: string): Industry {
    const industry = new Industry();
    const tenant = new Tenant();
    tenant.id = TenantId;
    const company = new Company();
    company.id = companyId;

    industry.id = `${Math.floor(Math.random() * 100) + 1}`;
    industry.title = title;
    industry.company = company;
    industry.tenant = [tenant];

    return industry;
  }

  static buildDeleteResult(): DeleteResult {
    const deleteResult = new DeleteResult();
    deleteResult.affected = 1;
    return deleteResult;
  }

  static buildOrder(): IOrderDTO {
    return { key: 'id', direction: 'DESC' };
  }
}
