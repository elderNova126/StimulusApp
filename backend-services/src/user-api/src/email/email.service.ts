import { Inject, Injectable } from '@nestjs/common';
import { ControllerGrpcClientService } from 'src/core/controller-client-grpc.service';
import { ServicesMapping, ProtoServices } from 'src/core/proto.constants';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import {
  ExternalUploadNotification,
  ExternalUploadNotificationSlack,
  MicroLoggingAlertonSlack,
} from './email.interface';

@Injectable()
export class EmailService {
  private readonly dataServiceMethods: any;

  constructor(
    private readonly logger: StimulusLogger,
    @Inject(ServicesMapping[ProtoServices.DATA])
    private readonly controllerGrpcClientDataService: ControllerGrpcClientService
  ) {
    this.logger.context = EmailService.name;
    this.dataServiceMethods = this.controllerGrpcClientDataService.serviceMethods;
  }

  public async sendExternalUploadNotification(body: ExternalUploadNotification): Promise<any> {
    try {
      return await this.controllerGrpcClientDataService.callProcedure(
        this.dataServiceMethods.sendExternalUploadNotification,
        body
      );
    } catch (err) {
      this.logger.error(`Failed to send external upload notification email`, err);
      throw err;
    }
  }

  public async sendExternalUploadNotificationSlack(body: ExternalUploadNotificationSlack): Promise<any> {
    try {
      return await this.controllerGrpcClientDataService.callProcedure(
        this.dataServiceMethods.sendExternalUploadNotificatiOnSlack,
        body
      );
    } catch (err) {
      this.logger.error(`Failed to send external upload notification to slack`, err);
      throw err;
    }
  }

  public async sendMicroLoggingAlertonSlack(body: MicroLoggingAlertonSlack): Promise<any> {
    try {
      return await this.controllerGrpcClientDataService.callProcedure(
        this.dataServiceMethods.sendMicroLoggingAlertOnSlack,
        body
      );
    } catch (err) {
      this.logger.error(`Failed to send the alert to slack`, err);
      throw err;
    }
  }
}
