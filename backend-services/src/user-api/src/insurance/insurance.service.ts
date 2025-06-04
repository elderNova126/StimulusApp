import { ActionResponseUnion } from './../models/baseResponse';
import { Injectable, Inject } from '@nestjs/common';
import { InsuranceSearchArgs, InsuranceArgs } from '../dto/insuranceArgs';
import { InsuranceResponseUnion, InsuranceUnion } from '../models/insurance';
import { DeleteArgs } from '../dto/deleteArgs';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { TracingArgs } from '../dto/tracingArgs';

@Injectable()
export class InsuranceService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }
  async searchInsurances(insuranceSearchArgs: InsuranceSearchArgs): Promise<typeof InsuranceResponseUnion> {
    const { query, companyId, ...insurance } = insuranceSearchArgs;
    const insuranceSearchGrpcArgs: any = { query, insurance };

    if (typeof companyId !== 'undefined') {
      insuranceSearchGrpcArgs.insurance.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchInsurances,

      insuranceSearchGrpcArgs
    );
  }

  async createInsurance(
    insuranceArgs: InsuranceArgs,
    tracingArgs: TracingArgs,
    userId: string
  ): Promise<typeof InsuranceUnion> {
    const { companyId, ...insuranceData } = insuranceArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;
    const createInsuranceArgs = companyId ? { ...insuranceData, company: { id: companyId } } : insuranceData;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createInsurance, {
      insurance: createInsuranceArgs,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }

  deleteInsurance(insuranceArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteInsurance, insuranceArgs);
  }

  updateInsurance(
    insuranceArgs: InsuranceArgs,
    tracingArgs: TracingArgs,
    userId: string
  ): Promise<typeof InsuranceUnion> {
    const { companyId, ...insuranceData } = insuranceArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;
    const updateInsuranceArgs = companyId ? { ...insuranceData, company: { id: companyId } } : insuranceData;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateInsurance, {
      insurance: updateInsuranceArgs,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }
}
