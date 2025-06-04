import { Inject, Injectable } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { CompanyListArgs, CompanyListSearchArgs } from '../dto/companyListArgs';
import { DeleteArgs } from '../dto/deleteArgs';
import { ActionResponseUnion } from '../models/baseResponse';
import { CompanyListUnion } from '../models/company-list';
import { CompanySearchArgs } from './../dto/companyArgs';
import { CompaniesResponse } from './../models/company';

@Injectable()
export class CompanyListService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  async searchCompanyLists(companyListSearchArgs: CompanyListSearchArgs, userId: string): Promise<any> {
    const { ...companyList } = companyListSearchArgs;
    const companyListSearchGrpcArgs: any = {
      companyList: { ...companyList, createdBy: userId },
    };

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchCompanyList,
      companyListSearchGrpcArgs
    );
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

  async searchCompanies(companySearchArgs: CompanySearchArgs, id_in: string[]): Promise<CompaniesResponse> {
    const { parentCompanyId, page, limit, orderBy, direction, isToCompare, isFavorite, ...company } = companySearchArgs;
    const pagination = { page, limit };
    const order = { key: orderBy, direction };
    const companySearchGrpcArgs: any = {
      ids: id_in,
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

  createCompanyList(companyListArgs: CompanyListArgs, userId: string): Promise<typeof CompanyListUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createCompanyList, {
      companyList: { ...companyListArgs, createdBy: userId },
    });
  }

  cloneCompanyList(companyListArgs: CompanyListArgs, userId: string): Promise<typeof CompanyListUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.cloneCompanyList, {
      ...companyListArgs,
      userId,
    });
  }

  updateCompanyList(companyListArgs: CompanyListArgs, userId: string): Promise<typeof CompanyListUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateCompanyList, {
      ...companyListArgs,
      userId,
    });
  }

  addToCompanyList(companyListArgs: CompanyListArgs, userId: string): Promise<typeof CompanyListUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.addToCompanyList, {
      ...companyListArgs,
      userId,
    });
  }

  removeFromCompanyList(companyListArgs: CompanyListArgs, userId: string): Promise<typeof CompanyListUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.removeFromCompanyList, {
      ...companyListArgs,
      userId,
    });
  }

  deleteCompanyList(companyListArgs: DeleteArgs, userId: string): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteCompanyList, {
      ...companyListArgs,
      userId,
    });
  }
}
