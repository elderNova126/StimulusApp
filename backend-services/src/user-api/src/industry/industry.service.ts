import { Injectable, Inject } from '@nestjs/common';
import { IndustryArgs } from '../dto/industryArgs';
import { IndustryResponseUnion, IndustryUnion } from '../models/industry';
import { ActionResponseUnion } from '../models/baseResponse';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { TracingArgs } from '../dto/tracingArgs';
import { DeleteIndustryArgs } from '../dto/deleteArgs';

@Injectable()
export class IndustryService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  async getAllIndustries(): Promise<typeof IndustryResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.searchIndustries, {});
  }

  createIndustry(industryArgs: IndustryArgs, tracingArgs: TracingArgs, userId: string): Promise<typeof IndustryUnion> {
    const { companyId, ...industryData } = industryArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;

    const createIndustryArgs = companyId ? { ...industryData, company: { id: companyId } } : industryData;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createIndustry, {
      industry: createIndustryArgs,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }

  deleteIndustry(industryArgs: DeleteIndustryArgs): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteIndustry, industryArgs);
  }

  updateIndustry(industryArgs: IndustryArgs, tracingArgs: TracingArgs, userId: string): Promise<typeof IndustryUnion> {
    const { companyId, ...industryData } = industryArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;

    const updateIndustryArgs = companyId ? { ...industryData, company: { id: companyId } } : industryData;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateIndustry, {
      industry: updateIndustryArgs,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }
}
