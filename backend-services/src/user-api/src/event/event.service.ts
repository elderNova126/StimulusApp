import { Injectable, Inject } from '@nestjs/common';
import { ProtoServices, ServicesMapping } from '../core/proto.constants';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { DeleteArgs } from '../dto/deleteArgs';
import { BaseResponse } from '../models/baseResponse';
import { EventArgs, EventSearchArgs } from '../dto/eventArgs';
import { Event, EventsResponse } from '../models/event';

@Injectable()
export class EventService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  async searchEvents(eventSearchArgs: EventSearchArgs, userId: string): Promise<EventsResponse> {
    const { page, limit, fromTimestamp, toTimestamp, companyId, projectId, notUserId, ...event } = eventSearchArgs;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.searchEvents, {
      pagination: { page, limit },
      notUserId,
      fromTimestamp,
      toTimestamp,
      companyId,
      projectId,
      userId,
      event,
    });
  }

  async createEvent(eventArgs: EventArgs): Promise<Event> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.createEvent, eventArgs);
  }

  deleteEvent(eventArgs: DeleteArgs): Promise<BaseResponse> {
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.deleteEvent, eventArgs);
  }

  async getUser(externalSystemAuthId: string) {
    const response = await this.controllerGrpcClientDataService.callProcedure(
      this.dataServiceMethods.getUsersByExternalIds,
      { externalAuthSystemIds: [externalSystemAuthId] }
    );

    if (response.error) return response;
    return response?.results?.[0];
  }
}
