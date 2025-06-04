import { CompanyList } from './company-list.entity';
export class CompanyListProvider {
  public static buildCompanyListById(id: number): CompanyList {
    const companyList = new CompanyList();
    companyList.id = id;
    companyList.companies = [];
    companyList.createdBy = 'createdBy';
    companyList.created = new Date();
    companyList.updated = new Date();
    companyList.name = 'name';
    companyList.isPublic = false;
    companyList.rowversion = Buffer.from('rowversion');
    return companyList;
  }

  public static buildCompanyLists(): CompanyList[] {
    return [this.buildCompanyListById(1), this.buildCompanyListById(2), this.buildCompanyListById(3)];
  }
}
