import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import axios from 'axios';
import { MAIL_SERVICE } from 'src/core/mail.providers';
import { CacheRedisService } from 'src/cache-for-redis/cache-redis.service';
import {
  ExternalUploadNotification,
  ExternalUploadNotificationSlack,
  PendingInvitationNotification,
  MicroLoggingAlertonSlack,
} from './email.interface';

@Injectable()
export class EmailService {
  private stimulusEmail: string;
  private slackDataTeamURI: string;
  private slackMicroLoggingURI: string;
  private readonly ERROR_NOTIFICATION_INTERVAL = 30 * 60 * 1000;

  constructor(
    @Inject(MAIL_SERVICE) private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly cacheRedisService: CacheRedisService
  ) {
    this.stimulusEmail = this.configService.get<string>('STIMULUS_EMAIL');
    this.slackDataTeamURI = this.configService.get<string>('SLACK_DATA_TEAM_URI');
    this.slackMicroLoggingURI = this.configService.get<string>('SLACK_MICRO_LOGGING_URI');
  }

  async sendExternalUploadNotification(data: ExternalUploadNotification) {
    const templateId = this.configService.get<string>('EMAIL_UPLOAD_EXTERNAL_FILE_TEMPLATE_ID');
    const recipientEmails = this.configService.get<string>('RECIPIENTS_FOR_EXTERNAL_FILE_UPLOAD_EMAIL');

    const toEmails = recipientEmails.split(',');

    return this.mailService.send({
      to: toEmails,
      from: this.stimulusEmail,
      templateId,
      dynamicTemplateData: {
        Name: data.name,
        Date: data.date,
        Count: data.count,
        Format: data.format,
      },
    });
  }

  async sendExternalUploadNotificationSlack(data: ExternalUploadNotificationSlack) {
    const message = {
      text:
        `:incoming_envelope: *Please be informed that ${data.customerName} has recently submitted their data throught our platform*\n\n` +
        `*Customer Name*: ${data.customerName}\n` +
        `*Submission Date*: ${data.date}\n` +
        `*Number of Files*: ${data.count}\n` +
        `*File Name*: ${data.fileName}\n` +
        `*File URL*: ${data.fileUrl}`,
    };

    return await axios.post(this.slackDataTeamURI, message);
  }

  async sendConnectionErrorNotificationSlack(error: Error) {
    const cacheKey = 'lastConnectionError';
    const cachedData = await this.cacheRedisService.get(cacheKey);
    const currentTime = Date.now();

    if (cachedData) {
      const { lastSentTimestamp, lastErrorName } = JSON.parse(cachedData);
      if (currentTime - lastSentTimestamp < this.ERROR_NOTIFICATION_INTERVAL && lastErrorName === error.name) {
        return;
      }
    }

    const message = {
      text:
        `:warning: *${error.name} occurred*\n\n` +
        `*Error Message*: ${error.message}\n` +
        `*Stack Trace*: ${error.stack}`,
    };

    try {
      await axios.post(this.slackMicroLoggingURI, message);
      const cacheValue = JSON.stringify({ lastSentTimestamp: currentTime, lastErrorName: error.name });
      await this.cacheRedisService.set(cacheKey, cacheValue, this.ERROR_NOTIFICATION_INTERVAL / 1000);
    } catch (error) {
      throw new Error('Error sending slack notification: ' + error.message);
    }
  }

  async sendMicroLoggingAlertOnSlack(data: MicroLoggingAlertonSlack) {
    const message =
      data.userAction === 'Sign On'
        ? `${data.email} has just signed in.`
        : data.userAction === 'Sign Up'
          ? `${data.email} has just signed up.`
          : data.userAction === 'Invite'
            ? `${data.email} has just invited from ${this.stimulusEmail}.`
            : data.userAction === 'Loading Data'
              ? 'Data loading is not working currently'
              : data.userAction === 'Delete Account'
                ? `${data.email} has just deleted their account.`
                : data.userAction === 'Project'
                  ? 'Project is not working currently'
                  : 'Unknown user action.';
    return await axios.post(this.slackMicroLoggingURI, { text: message });
  }

  async sendPendingInvitationNotification(data: PendingInvitationNotification) {
    const templateId = this.configService.get<string>('EMAIL_PENDING_INVITATION_TEMPLATE_ID');
    return this.mailService.send({
      to: data.toEmail,
      from: this.stimulusEmail,
      templateId,
      dynamicTemplateData: {
        Name: data.name,
        ListName: data.listName,
        InviteUser: data.inviteUser,
      },
    });
  }
}
