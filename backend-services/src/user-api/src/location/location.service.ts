import { Inject, Injectable } from '@nestjs/common';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { DeleteArgs } from '../dto/deleteArgs';
import { LocationArgs, LocationSearchArgs } from '../dto/locationArgs';
import { TracingArgs } from '../dto/tracingArgs';
import { ActionResponseUnion } from '../models/baseResponse';
import { LocationResponseUnion, LocationUnion } from '../models/location';

@Injectable()
export class LocationService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }
  async searchLocations(locationSearchArgs: LocationSearchArgs): Promise<typeof LocationResponseUnion> {
    const { query, companyId, contactId, ...location } = locationSearchArgs;
    const locationSearchGrpcArgs: any = { query, location };

    if (typeof companyId !== 'undefined') {
      locationSearchGrpcArgs.location.company = { id: companyId };
    }
    if (typeof contactId !== 'undefined') {
      locationSearchGrpcArgs.location.contact = { id: contactId };
    }

    return this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.searchLocations,

      locationSearchGrpcArgs
    );
  }

  createLocation(locationArgs: LocationArgs, tracingArgs: TracingArgs, userId: string): Promise<typeof LocationUnion> {
    const { companyId, contactId, ...rest } = locationArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;
    const createLocationArgs: any = rest;

    if (companyId) {
      createLocationArgs.company = { id: companyId };
    }
    if (contactId) {
      createLocationArgs.contact = { id: contactId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createLocation, {
      location: createLocationArgs,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }

  deleteLocation(locationArgs: DeleteArgs): Promise<typeof ActionResponseUnion> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteLocation, locationArgs);
  }

  updateLocation(locationArgs: LocationArgs, tracingArgs: TracingArgs, userId: string): Promise<typeof LocationUnion> {
    const { companyId, contactId, ...rest } = locationArgs;
    const { dataTraceSource, traceFrom } = tracingArgs;
    const updateLocationArgs: any = rest;

    if (companyId) {
      updateLocationArgs.company = { id: companyId };
    }
    if (contactId) {
      updateLocationArgs.contact = { id: contactId };
    }

    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.updateLocation, {
      location: updateLocationArgs,
      userId,
      dataTraceSource,
      traceFrom: traceFrom ?? 'API',
    });
  }
}
