import { Inject, Injectable } from '@nestjs/common';
import { controller } from 'controller-proto/codegen/tenant_pb';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { CompanyDiscoveryArgs, CountCompaniesByListArgs } from '../dto/companyArgs';
import { CompaniesResponseUnion, CountCompaniesResponseUnion } from '../models/company';
import { COMPANY_DISCOVERY_MAP_VIEW, COMPANY_DISVOERY_LIST_VIEW } from './company-discovery.constants';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';

@Injectable()
export class CompanyDiscoveryService {
  private readonly discoveryServiceMethods: any;
  private stringTypes = [
    'industry',
    'location',
    'typeOfLegalEntity',
    'companyStatus',
    'companyType',
    'product',
    'certification',
    'insurance',
    'postalCode',
    'country',
    'state',
    'city',
    'addressStreet',
  ];
  private arrayOfStringsTypes = [
    'diverseOwnership',
    'tags',
    'lists',
    'industries',
    'relationships',
    'minorityOwnership',
  ];
  private booleanTypes = ['isFavorite'];

  constructor(
    @Inject(ServicesMapping[ProtoServices.DISCOVERY])
    private readonly controllerGrpcClientDiscoveryService: ControllerGrpcClientService,
    private readonly mylogger: StimulusLogger
  ) {
    this.discoveryServiceMethods = this.controllerGrpcClientDiscoveryService.serviceMethods;
    this.mylogger.context = CompanyDiscoveryService.name;
    this.mylogger.debug('CompanyDiscoveryService debug');
  }

  async discoverCompanies(
    companyDiscoveryArgs: CompanyDiscoveryArgs,
    FronEndView: string
  ): Promise<typeof CompaniesResponseUnion> {
    this.mylogger.debug('discoverCompanies function called');
    const {
      query,
      filterSearch,
      page,
      limit,
      assetsPctOfRevenueFrom,
      assetsPctOfRevenueTo,
      assetsFrom,
      assetsTo,
      customerValueFrom,
      customerValueTo,
      brandValueFrom,
      brandValueTo,
      employeeValueFrom,
      employeeValueTo,
      employeesGrowthFrom,
      employeesGrowthTo,
      longevityValueFrom,
      longevityValueTo,
      scoreValueFrom,
      scoreValueTo,
      revenueFrom,
      revenueTo,
      employeesFrom,
      employeesTo,
      revenueGrowthFrom,
      revenueGrowthTo,
      revenuePerEmployeeFrom,
      revenuePerEmployeeTo,
      boardTotalFrom,
      boardTotalTo,
      leadershipTeamTotalFrom,
      leadershipTeamTotalTo,
      netProfitFrom,
      netProfitTo,
      netProfitPctFrom,
      netProfitPctTo,
      liabilitiesFrom,
      liabilitiesTo,
      liabilitiesPctOfRevenueFrom,
      liabilitiesPctOfRevenueTo,
      customersFrom,
      customersTo,
      netPromoterScoreFrom,
      netPromoterScoreTo,
      twitterFollowersFrom,
      twitterFollowersTo,
      linkedInFollowersFrom,
      linkedInFollowersTo,
      facebookFollowersFrom,
      facebookFollowersTo,
      orderBy,
      direction,
      tenantId,
      // degreeOfSeparation,
      amountSpentFrom,
      amountSpentTo,
      projectsCountFrom,
      projectsCountTo,
      teamCountFrom,
      teamCountTo,
      relationshipLengthFrom,
      relationshipLengthTo,
      radius,
      ...regular
    } = companyDiscoveryArgs;
    const locationFilter = this.createLocationRangeElement(
      companyDiscoveryArgs.latitude,
      companyDiscoveryArgs.longitude,
      radius
    );
    const rangeFilters = [
      this.createRangeElement(customerValueFrom, customerValueTo, 'score/customerValue'),
      this.createRangeElement(brandValueFrom, brandValueTo, 'score/brandValue'),
      this.createRangeElement(employeeValueFrom, employeeValueTo, 'score/employeeValue'),
      this.createRangeElement(longevityValueFrom, longevityValueTo, 'score/longevityValue'),
      this.createRangeElement(scoreValueFrom, scoreValueTo, 'score/scoreValue'),
      this.createRangeElement(revenueFrom, revenueTo, 'revenue'),
      this.createRangeElement(employeesFrom, employeesTo, 'employeesTotal'),
      this.createRangeElement(employeesGrowthFrom, employeesGrowthTo, 'employeesTotalGrowthCAGR_double'),
      this.createRangeElement(assetsPctOfRevenueFrom, assetsPctOfRevenueTo, 'assetsPctOfRevenue'),
      this.createRangeElement(assetsFrom, assetsTo, 'totalAssets_double'),
      this.createRangeElement(revenueGrowthFrom, revenueGrowthTo, 'revenueGrowthCAGR'),
      this.createRangeElement(revenuePerEmployeeFrom, revenuePerEmployeeTo, 'revenuePerEmployee'),
      this.createRangeElement(boardTotalFrom, boardTotalTo, 'boardTotal'),
      this.createRangeElement(leadershipTeamTotalFrom, leadershipTeamTotalTo, 'leadershipTeamTotal'),
      this.createRangeElement(netProfitFrom, netProfitTo, 'netProfit'),
      this.createRangeElement(netProfitPctFrom, netProfitPctTo, 'netProfitPct'),
      this.createRangeElement(liabilitiesFrom, liabilitiesTo, 'totalLiabilities'),
      this.createRangeElement(liabilitiesPctOfRevenueFrom, liabilitiesPctOfRevenueTo, 'liabilitiesPctOfRevenue'),
      this.createRangeElement(customersFrom, customersTo, 'customers'),
      this.createRangeElement(netPromoterScoreFrom, netPromoterScoreTo, 'netPromoterScore'),
      this.createRangeElement(twitterFollowersFrom, twitterFollowersTo, 'twitterFollowers'),
      this.createRangeElement(linkedInFollowersFrom, linkedInFollowersTo, 'linkedInFollowers'),
      this.createRangeElement(facebookFollowersFrom, facebookFollowersTo, 'facebookFollowers'),
      this.createRangeElement(amountSpentFrom, amountSpentTo, 'amountSpent'),
      this.createRangeElement(relationshipLengthFrom, relationshipLengthTo, 'relationshipLength'),
      this.createRangeElement(projectsCountFrom, projectsCountTo, 'projectsCount'),
      this.createRangeElement(teamCountFrom, teamCountTo, 'teamCount'),
    ].filter((item) => item);
    const regularFilters: any = Object.keys(regular).map((value: string) => {
      let keyTypeValue = controller.QueryFilter.KeyType.DOUBLE;

      if (this.stringTypes.indexOf(value) > -1) keyTypeValue = controller.QueryFilter.KeyType.STRING;
      else if (this.arrayOfStringsTypes.indexOf(value) > -1)
        keyTypeValue = controller.QueryFilter.KeyType.ARRAY_STRINGS;
      else if (this.booleanTypes.indexOf(value) > -1) keyTypeValue = controller.QueryFilter.KeyType.BOOLEAN;

      const filter: any = { key: value, keyType: keyTypeValue };
      if (filter.keyType === controller.QueryFilter.KeyType.ARRAY_STRINGS) filter.array = { values: regular[value] };
      else filter.value = regular[value];
      return filter;
    });
    const tenantFilter: any = tenantId
      ? [{ key: 'tenantId', keyType: controller.QueryFilter.KeyType.STRING, value: tenantId }]
      : [];
    return this.controllerGrpcClientDiscoveryService.callProcedure(this.handelSelectRPCmethod(FronEndView), {
      search: query,
      column: filterSearch,
      filters: [...rangeFilters, ...regularFilters, ...tenantFilter],
      pagination: { page, limit },
      order: { key: orderBy, ...(direction && { direction }) },
      locationRange: companyDiscoveryArgs.latitude && companyDiscoveryArgs.longitude ? locationFilter : null,
    });
  }

  async countCompaniesByList(companyByListArgs: CountCompaniesByListArgs): Promise<typeof CountCompaniesResponseUnion> {
    const { listType } = companyByListArgs;
    return this.controllerGrpcClientDiscoveryService.callProcedure(this.discoveryServiceMethods.countCompaniesByList, {
      listType,
    });
  }

  private createRangeElement(start, end, key) {
    if (start || end) {
      return {
        key,
        keyType: controller.QueryFilter.KeyType.DOUBLE,
        range: {
          ...(start && { start: `${start}` }),
          ...(end && { end: `${end}` }),
        },
      };
    }
  }

  private createLocationRangeElement(latitude, longitude, radius) {
    if (!latitude || !longitude) return null;
    const converseMillatoKm = radius * 1.60934;
    return {
      lat: latitude,
      lng: longitude,
      radius: converseMillatoKm,
    };
  }

  handelSelectRPCmethod(FronEndView) {
    const RPCMethods = {
      [COMPANY_DISCOVERY_MAP_VIEW]: this.discoveryServiceMethods.discoverCompaniesMap,
      [COMPANY_DISVOERY_LIST_VIEW]: this.discoveryServiceMethods.discoverCompanies,
    };
    return RPCMethods[FronEndView] || this.discoveryServiceMethods.discoverCompanies;
  }
}
