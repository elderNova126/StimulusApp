import { Injectable, Inject } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { TriggerCalculationArgs } from '../dto/stimulusScoreArgs';
import { ActionResponseUnion } from '../models/baseResponse';
import { TenantCompanyRelationResponseUnion } from '../models/tenantCompanyRelation';

@Injectable()
export class OnDemandService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService,
    private readonly logger: StimulusLogger
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
    this.logger.context = OnDemandService.name;
  }

  async triggerScoreCalculation(args: TriggerCalculationArgs): Promise<typeof ActionResponseUnion> {
    const response = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.calculateStimulusScore,
      args
    );
    return { done: response?.success ?? false };
  }

  async triggerRelationUpdate(): Promise<typeof TenantCompanyRelationResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.triggerRelationUpdate, {});
  }
}
