import { CompanyNames, CompanyNameType } from './company-names.entity';

export class CompanyNamesProvider {
  public static buildCompanyName(companyId: string, type?: CompanyNameType, index?: number): CompanyNames {
    const companyNames = new CompanyNames();
    companyNames.id = index || 1;
    companyNames.name = index ? `name-${index}` : 'name';
    companyNames.type = type || CompanyNameType.OTHER;
    companyNames.companyId = companyId;
    return companyNames;
  }

  public static buildCompanyNames(companyId: string): CompanyNames[] {
    this.buildCompanyName(companyId);
    return [this.buildCompanyName(companyId), this.buildCompanyName(companyId, CompanyNameType.PREVIOUS, 2)];
  }
}
