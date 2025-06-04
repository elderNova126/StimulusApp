import { BaseResponse } from './../models/baseResponse';
import { Injectable, Inject } from '@nestjs/common';
import { ContingencySearchArgs, ContingencyArgs } from '../dto/contingencyArgs';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ContingencyUnion, ContingencyResponseUnion } from '../models/contingency';
import { DeleteArgs } from '../dto/deleteArgs';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { TracingArgs } from '../dto/tracingArgs';

@Injectable()
export class ContingencyService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }
  async searchContingencies(contingencySearchArgs: ContingencySearchArgs): Promise<typeof ContingencyResponseUnion> {
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

  createContingency(
    contingencyArgs: ContingencyArgs,
    tracingArgs: TracingArgs,
    userId: string
  ): Promise<typeof ContingencyUnion> {
    const { companyId, ...contingencyData } = contingencyArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;
    const createContingencyArgs = companyId ? { ...contingencyData, company: { id: companyId } } : contingencyData;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createContingency, {
      contingency: createContingencyArgs,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }

  deleteContingency(contingencyArgs: DeleteArgs): Promise<BaseResponse> {
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.deleteContingency,
      contingencyArgs
    );
  }

  updateContingency(
    contingencyArgs: ContingencyArgs,
    tracingArgs: TracingArgs,
    userId: string
  ): Promise<typeof ContingencyUnion> {
    const { companyId, ...contingencyData } = contingencyArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;
    const updateContingencyArgs = companyId ? { ...contingencyData, company: { id: companyId } } : contingencyData;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateContingency, {
      contingency: updateContingencyArgs,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }
}
