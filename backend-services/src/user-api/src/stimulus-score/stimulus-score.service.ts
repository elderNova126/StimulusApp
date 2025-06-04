import { Inject, Injectable } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { DeleteArgs } from '../dto/deleteArgs';
import { StimulusScoreArgs, StimulusScoreSearchArgs } from '../dto/stimulusScoreArgs';
import { ActionResponseUnion } from '../models/baseResponse';
import { StimulusScoreResponseUnion, StimulusScoreUnion } from '../models/stimulusScore';

@Injectable()
export class StimulusScoreService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
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

  async createStimulusScore(stimulusScoreArgs: StimulusScoreArgs): Promise<typeof StimulusScoreUnion> {
    const { companyId, internalCompanyId, ...rest } = stimulusScoreArgs;
    const createStimulusScoreArgs: any =
      companyId || internalCompanyId ? { company: { id: companyId, internalId: internalCompanyId }, ...rest } : rest;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createStimulusScore, {
      stimulusScore: createStimulusScoreArgs,
    });
  }

  deleteStimulusScore(stimulusScoreArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.deleteStimulusScore,
      stimulusScoreArgs
    );
  }

  updateStimulusScore(stimulusScoreArgs: StimulusScoreArgs): Promise<typeof StimulusScoreUnion> {
    const { companyId, ...rest } = stimulusScoreArgs;
    const updateStimulusScoreArgs: any = companyId ? { company: { id: companyId }, ...rest } : rest;

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateStimulusScore, {
      stimulusScore: updateStimulusScoreArgs,
    });
  }
}
