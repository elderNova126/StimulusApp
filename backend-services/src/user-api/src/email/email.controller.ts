import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import {
  ExternalUploadNotification,
  ExternalUploadNotificationSlack,
  MicroLoggingAlertonSlack,
} from './email.interface';
import { EmailService } from './email.service';
import { Response } from 'express';

@Controller('email')
export class EmailController {
  constructor(
    private readonly logger: StimulusLogger,
    private readonly emailService: EmailService
  ) {}

  @Post('/external-upload')
  async externalUploadNotification(@Body() body: ExternalUploadNotification, @Res() res: Response) {
    try {
      const resp = await this.emailService.sendExternalUploadNotification(body);
      if (resp.success) {
        res.status(HttpStatus.OK).send();
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(resp.message);
      }
    } catch (error) {
      this.logger.error(`Failed to send external upload notification email`, error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }

  @Post('/external-upload-slack')
  async externalUploadNotificationSlack(@Body() body: ExternalUploadNotificationSlack, @Res() res: Response) {
    try {
      const resp = await this.emailService.sendExternalUploadNotificationSlack(body);
      if (resp.success) {
        res.status(HttpStatus.OK).send();
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(resp.message);
      }
    } catch (error) {
      this.logger.error(`Failed to send external upload notification email`, error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
  @Post('/logging-slack')
  async MicroLoggingAlertonSlack(@Body() body: MicroLoggingAlertonSlack, @Res() res: Response) {
    try {
      const resp = await this.emailService.sendMicroLoggingAlertonSlack(body);
      if (resp.success) {
        res.status(HttpStatus.OK).send();
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(resp.message);
      }
    } catch (error) {
      this.logger.error(`Failed to alert on Slack`, error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
  }
}
