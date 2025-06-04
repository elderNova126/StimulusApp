import { BaseResponse } from './../models/baseResponse';
import { Injectable, Inject } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { DataPointSearchArgs, DataPointArgs } from '../dto/dataPointArgs';
import { DataPoint } from '../models/dataPoint';
import { DeleteArgs } from '../dto/deleteArgs';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';

@Injectable()
export class DataPointService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
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

    return result.results || [];
  }

  createDataPoint(dataPointArgs: DataPointArgs): Promise<DataPoint> {
    const { companyId, ...dataPointData } = dataPointArgs;
    const createDataPointArgs: any = dataPointData;

    if (typeof companyId !== 'undefined') {
      createDataPointArgs.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createDataPoint, {
      dataPoint: createDataPointArgs,
    });
  }

  deleteDataPoint(dataPointArgs: DeleteArgs): Promise<BaseResponse> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteDataPoint, dataPointArgs);
  }

  updateDataPoint(DataPointArgs: DataPointArgs): Promise<DataPoint> {
    const { companyId, ...dataPointData } = DataPointArgs;
    const updateDataPointArgs: any = dataPointData;

    if (typeof companyId !== 'undefined') {
      updateDataPointArgs.company = { id: companyId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateDataPoint, {
      dataPoint: updateDataPointArgs,
    });
  }
}
