import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { CertificationSearchArgs } from '../dto/certificationArgs';
import {
  CompanyActivityLogArgs,
  CompanyArgs,
  CompanyDiscoveryArgs,
  CompanySearchArgs,
  CompanyUpdateArgs,
  InternalCompaniesDashboardArgs,
  UnusedCompanySearchArgs,
} from '../dto/companyArgs';
import { ContactSearchArgs } from '../dto/contactArgs';
import { ContingencySearchArgs } from '../dto/contingencyArgs';
import { DataPointSearchArgs } from '../dto/dataPointArgs';
import { DeleteCompanyArgs } from '../dto/deleteArgs';
import { InsuranceSearchArgs } from '../dto/insuranceArgs';
import { LocationSearchArgs } from '../dto/locationArgs';
import { NoteSearchArgs } from '../dto/noteArgs';
import { ProductSearchArgs } from '../dto/productArgs';
import { ProjectSearchArgs } from '../dto/projectArgs';
import { StimulusScoreSearchArgs } from '../dto/stimulusScoreArgs';
import { TenantCompanyArgs } from '../dto/tenantCompanyRelationshipArgs';
import { TracingArgs } from '../dto/tracingArgs';
import { BaseResponse } from '../models/baseResponse';
import { CertificationResultUnion } from '../models/certification';
import { CompaniesResponse, CompaniesResponseUnion, Company } from '../models/company';
import { CompanyNotesResponse } from '../models/company-note';
import { Contact } from '../models/contact';
import { Contingency } from '../models/contingency';
import { DataPoint } from '../models/dataPoint';
import { EventsResponseUnion } from '../models/event';
import { Insurance } from '../models/insurance';
import { Location } from '../models/location';
import { Product } from '../models/product';
import { ProjectsResponse } from '../models/project';
import { StimulusScoreResponseUnion } from '../models/stimulusScore';

@Injectable()
export class CompanyService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService,
    private readonly configService: ConfigService,
    private httpService: HttpService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  /**
   * Append settings to a company when settings are applied
   * Used for search companies by specific setting
   *
   * @param company
   * @param items an object that contains settings
   */
  appendSettings(company: any, items: any) {
    const tenantCompanyRelation = {};

    Object.keys(items).forEach((key) => {
      if (typeof items[key] !== 'undefined') {
        tenantCompanyRelation[key] = items[key];
      }
    });

    return Object.keys(tenantCompanyRelation).length > 0 ? { ...company, tenantCompanyRelation } : company;
  }
  searchCompaniesSubset(query) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.searchCompaniesSubset, { query });
  }

  searchCompaniesByTaxId(query) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.searchCompaniesByTaxId, {
      query,
    });
  }

  async searchCompanies(companySearchArgs: CompanySearchArgs): Promise<CompaniesResponse> {
    const { parentCompanyId, page, limit, orderBy, direction, isToCompare, isFavorite, ids, ...company } =
      companySearchArgs;
    const pagination = { page, limit };
    const order = { key: orderBy, direction };
    const companySearchGrpcArgs: any = {
      ids,
      company: this.appendSettings(company, { isFavorite, isToCompare }),
      pagination,
      order,
    };

    if (typeof parentCompanyId !== 'undefined') {
      companySearchGrpcArgs.company.parentCompany = { id: parentCompanyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchCompanies,
      companySearchGrpcArgs
    );
  }
  async searchCompanyById(id: string): Promise<CompaniesResponse> {
    const companySearchGrpcArgs: any = { id };

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchCompanyById,
      companySearchGrpcArgs
    );
  }

  async searchSettings(companyId: string, tenantCompanyRelationArgs: TenantCompanyArgs): Promise<TenantCompanyArgs> {
    const tenantCompanyRelationSearchGrpcArgs: any = { tenantCompanyRelation: tenantCompanyRelationArgs };

    if (typeof companyId !== 'undefined') {
      tenantCompanyRelationSearchGrpcArgs.tenantCompanyRelation.company = { id: companyId };
    }

    const { results } = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchTenantCompanyRelation,
      tenantCompanyRelationSearchGrpcArgs
    );

    return (results && results[0]) || [];
  }

  async getDistinctTags() {
    const res = await this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getDistinctTags, {});

    return { tags: res.values };
  }
  async filterCompanyTag(tag: string) {
    const res = await this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.filterCompanyTag, {
      tag,
    });

    return { tags: res.values };
  }

  async getDistinctDiverseOwnership() {
    const res = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getDistinctDiverseOwnership,
      {}
    );

    return { diverseOwnership: res.values };
  }

  async getDistinctMinoritiesOwnership() {
    const res = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getDistinctMinorityOwnership,
      {}
    );

    return { minorityOwnership: res.values };
  }

  async getMinorityOwnership() {
    const res = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getMinorityOwnership,
      {}
    );

    return res.results;
  }

  async searchNews(companyName: string) {
    const token = this.configService.get<string>('GNEWS_TOKEN');
    const to = new Date().toISOString().split('.')[0] + 'Z';

    const response = await this.httpService
      .get(`https://gnews.io/api/v3/search?max=10&q=${companyName}&token=${token}&to=${to}`)
      .toPromise();
    const articles = response?.data.articles || [];

    const now = new Date();
    const filteredArticles = articles.filter((article) => new Date(article.publishedAt) <= now);

    const latestArticles = filteredArticles.slice(0, 3);

    return latestArticles;
  }

  async getActivityLog(companyActivityArgs: CompanyActivityLogArgs): Promise<typeof EventsResponseUnion> {
    const { companyId, page, limit, orderBy, direction } = companyActivityArgs;
    const pagination = { page, limit };
    const order = { key: orderBy, direction };

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getCompanyActivityLog, {
      company: { id: companyId },
      pagination,
      order,
    });
  }
  async searchProjects(companyId: string, projectSearchArgs: ProjectSearchArgs): Promise<ProjectsResponse> {
    const { companyType, page, limit, orderBy, direction, ...project } = projectSearchArgs;
    const pagination = { page, limit };
    const order = { key: orderBy, direction };

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.searchProjects, {
      projectPayload: { project: { ...project, deleted: false }, companyId, companyType },
      pagination,
      order,
    });
  }

  async searchContacts(companyId: string, contactSearchArgs: ContactSearchArgs): Promise<Contact[]> {
    const { query, ...contact } = contactSearchArgs;
    const contactSearchGrpcArgs: any = { query, contact };

    if (typeof companyId !== 'undefined') {
      contactSearchGrpcArgs.contact.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchContacts,
      contactSearchGrpcArgs
    );
  }

  async searchProducts(companyId: string, productSearchArgs: ProductSearchArgs): Promise<Product[]> {
    const { query, ...product } = productSearchArgs;
    const productSearchGrpcArgs: any = { query, product };

    if (typeof companyId !== 'undefined') {
      productSearchGrpcArgs.product.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchProducts,
      productSearchGrpcArgs
    );
  }

  async searchInsurances(companyId: string, insuranceSearchArgs: InsuranceSearchArgs): Promise<Insurance[]> {
    const { query, ...insurance } = insuranceSearchArgs;
    const insuranceSearchGrpcArgs: any = { query, insurance };

    if (typeof companyId !== 'undefined') {
      insuranceSearchGrpcArgs.insurance.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchInsurances,
      insuranceSearchGrpcArgs
    );
  }

  async searchLocations(companyId: string, locationSearchArgs: LocationSearchArgs): Promise<Location[]> {
    const { query, contactId, ...location } = locationSearchArgs;
    const locationSearchGrpcArgs: any = { query, location };

    if (typeof companyId !== 'undefined') {
      locationSearchGrpcArgs.location.company = { id: companyId };
    }
    if (typeof contactId !== 'undefined') {
      locationSearchGrpcArgs.location.contact = { id: contactId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchLocations,
      locationSearchGrpcArgs
    );
  }

  searchCertifications(
    companyId: string,
    certificationSearchArgs: CertificationSearchArgs
  ): Promise<typeof CertificationResultUnion> {
    const { query, ...certification } = certificationSearchArgs;
    const certificationSearchGrpcArgs: any = { query, certification };

    if (typeof companyId !== 'undefined') {
      certificationSearchGrpcArgs.certification.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchCertifications,
      certificationSearchGrpcArgs
    );
  }

  async searchStimulusScores(
    stimulusScoreSearchArgs: StimulusScoreSearchArgs
  ): Promise<typeof StimulusScoreResponseUnion> {
    const { query, companyId, page, limit, orderBy, direction, ...stimulusScore } = stimulusScoreSearchArgs;
    const pagination = { page, limit };
    const order = { key: orderBy, direction };
    const stimulusScoreSearchGrpcArgs: any = { query, stimulusScore, pagination, order };

    if (typeof companyId !== 'undefined') {
      stimulusScoreSearchGrpcArgs.stimulusScore.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchStimulusScores,
      stimulusScoreSearchGrpcArgs
    );
  }

  async searchDataPoints(dataPointSearchArgs: DataPointSearchArgs): Promise<DataPoint[]> {
    const { query, companyId, ...dataPoint } = dataPointSearchArgs;
    const dataPointSearchGrpcArgs: any = { query, dataPoint };

    if (typeof companyId !== 'undefined') {
      dataPointSearchGrpcArgs.dataPoint.company = { id: companyId };
    }

    const result = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchDataPoints,
      dataPointSearchGrpcArgs
    );

    return result.results;
  }

  async searchContingencies(contingencySearchArgs: ContingencySearchArgs): Promise<Contingency[]> {
    const { query, companyId, ...contingency } = contingencySearchArgs;
    const contingencySearchGrpcArgs: any = { query, contingency };

    if (typeof companyId !== 'undefined') {
      contingencySearchGrpcArgs.contingency.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchContingencies,
      contingencySearchGrpcArgs
    );
  }

  async searchNotes(noteSearchArgs: NoteSearchArgs): Promise<CompanyNotesResponse> {
    const { query, companyId, page, limit, ...note } = noteSearchArgs;
    const pagination = { page, limit };
    const noteSearchGrpcArgs: any = { note, query, pagination };

    if (companyId) {
      noteSearchGrpcArgs.note.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchCompanyNotes,
      noteSearchGrpcArgs
    );
  }

  getProjectsOverview(companyId: string) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getCompanyProjectOverview, {
      companyId,
    });
  }

  createCompany(companyArgs: CompanyArgs): Promise<Company> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createCompany, {
      company: companyArgs,
    });
  }

  deleteCompany(deleteArgs: DeleteCompanyArgs): Promise<BaseResponse> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteCompany, deleteArgs);
  }

  updateCompany(companyArgs: CompanyUpdateArgs, tracingArgs: TracingArgs, userId: string): Promise<Company> {
    const { dataTraceSource, traceFrom } = tracingArgs;
    const { parentCompanyId, newCustomIndustries, industryIds, diverseOwnership, minorityOwnedShip, ...company }: any =
      companyArgs;

    this.checkOwnerships([diverseOwnership, minorityOwnedShip]);

    company.parentCompany = parentCompanyId;
    this.handlerTagsUpdater(company);
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateCompany, {
      company: { ...company, diverseOwnership, minorityOwnedShip },
      industriesPayload: newCustomIndustries || industryIds ? { newCustomIndustries, industryIds } : undefined,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }
  async searchUnusedCompanies(unusedCompanySearchArgs: UnusedCompanySearchArgs): Promise<CompaniesResponse> {
    const { page, limit, orderBy, direction, createdFrom, createdTo } = unusedCompanySearchArgs;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.searchUnusedCompanies, {
      pagination: { page, limit },
      order: { key: orderBy, ...(direction && { direction }) },
      createdFrom,
      createdTo,
    });
  }
  async getInternalCompaniesDashboard(internalCompaniesDashboardArgs: InternalCompaniesDashboardArgs): Promise<any> {
    const { granularityFilter, timePeriodFilter } = internalCompaniesDashboardArgs;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getInternalCompaniesDashboard, {
      granularityFilter,
      timePeriodFilter,
    });
  }
  async checkInternalDataDashboard(): Promise<any> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.checkDataInternalDashboard, {});
  }
  handlerTagsUpdater(company: any) {
    if (company.tags) {
      company.tags = company.tags.map((tag: string) => {
        return { tag };
      });
    }
    if (company.tags && company.tags.length === 0) {
      company.tags.push({ tag: '' });
    }
  }

  async getCompaniesByTaxIdAndName(companyDiscoveryArgs: CompanyDiscoveryArgs): Promise<typeof CompaniesResponseUnion> {
    const { query, filterSearch, page, limit, orderBy, direction } = companyDiscoveryArgs;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getCompaniesByTaxIdAndName, {
      search: query,
      column: filterSearch,
      pagination: { page, limit },
      order: { key: orderBy, ...(direction && { direction }) },
    });
  }

  private checkOwnerships(ownerships: string[][]) {
    const emptyValue = 'PAST_TO_EMPTY';
    for (const ownership of ownerships) {
      if (!ownership) continue;
      if (ownership.length === 0) ownership.push(emptyValue);
    }
  }
}
