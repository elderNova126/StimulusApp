import { Scope } from '@nestjs/common';
import { MailService } from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

export const MAIL_SERVICE = 'MailService';

export const mailProviders = [
  {
    provide: MAIL_SERVICE,
    scope: Scope.DEFAULT,
    useFactory: async (configService: ConfigService) => {
      const sendgridApiKey = configService.get<string>('SENDGRID_API_KEY');
      const mailService = new MailService();
      mailService.setApiKey(sendgridApiKey);
      return mailService;
    },
    inject: [ConfigService],
  },
];
