import { EmbedMultipleReportsArgs, EmbedReportArgs } from './../dto/reportArgs';
import { Inject, Injectable } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';

@Injectable()
export class ReportingService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  async getAllReports() {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getAllReports, {});
  }

  getReportEmbeddingParameters(params: EmbedReportArgs) {
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getReportEmbeddingParameters,
      params
    );
  }

  getMultipleReportsEmbeddingParameters(params: EmbedMultipleReportsArgs) {
    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getMultipleReportsEmbeddingParameters,
      params
    );
  }
}
