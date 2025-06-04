import { Injectable, Inject } from '@nestjs/common';
import { ServicesMapping, ProtoServices } from '../core/proto.constants';
import { ControllerGrpcClientService } from '../core/controller-client-grpc.service';
import { SearchNotificationArgs, ReadNotificationArgs } from '../dto/notificationArgs';

@Injectable()
export class NotificationService {
  private readonly dataServiceMethods: any;
  constructor(
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  getNotifications(notificationArgs: SearchNotificationArgs, userId: string) {
    const { page, limit, ...rest } = notificationArgs;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.getNotifications, {
      userId,
      ...rest,
      pagination: { page, limit },
    });
  }

  readNotification(notificationArgs: ReadNotificationArgs, userId: string) {
    const { id } = notificationArgs;
    return this.controllerGrpcClientDataService.callProcedure(this.dataServiceMethods.readNotification, {
      userId,
      notification: { id, read: true },
    });
  }
}
