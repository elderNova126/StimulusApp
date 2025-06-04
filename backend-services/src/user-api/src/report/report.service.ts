import { Inject, Injectable } from '@nestjs/common';
import { ControllerGrpcClientService } from 'src/core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from 'src/core/proto.constants';
import { ReportDataArgs } from 'src/dto/reportDataArgs';

@Injectable()
export class ReportService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  async getReportData(params: ReportDataArgs) {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getReportData, params);
  }
}
