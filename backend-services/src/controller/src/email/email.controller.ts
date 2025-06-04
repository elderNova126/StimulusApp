import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoggingInterceptor } from 'src/logging/logger.interceptor';
import {
  EmailResponse,
  ExternalUploadNotification,
  ExternalUploadNotificationSlack,
  MicroLoggingAlertonSlack,
} from './email.interface';
import { EmailService } from './email.service';

@Controller('email')
@UseInterceptors(LoggingInterceptor)
export class EmailController {
  public constructor(private readonly emailService: EmailService) {}

  @GrpcMethod('DataService', 'SendExternalUploadNotification')
  async sendExternalUploadNotification(data: ExternalUploadNotification): Promise<EmailResponse> {
    try {
      await this.emailService.sendExternalUploadNotification(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err };
    }
  }

  @GrpcMethod('DataService', 'SendExternalUploadNotificationSlack')
  async sendExternalUploadNotificationSlack(data: ExternalUploadNotificationSlack): Promise<EmailResponse> {
    try {
      await this.emailService.sendExternalUploadNotificationSlack(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err };
    }
  }

  @GrpcMethod('DataService', 'SendMicroLoggingAlertOnSlack')
  async sendMicroLoggingAlertOnSlack(data: MicroLoggingAlertonSlack): Promise<EmailResponse> {
    try {
      await this.emailService.sendMicroLoggingAlertOnSlack(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err };
    }
  }
}
