import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@sendgrid/mail';
import { MAIL_SERVICE } from 'src/core/mail.providers';
import { Tenant } from 'src/tenant/tenant.entity';
import { User } from './user.entity';

@Injectable()
export class UserEmailService {
  private adminEmail: string;
  private stimulusEmail: string;
  private clientAppUrl: string;
  private newClientAppUrl: string;

  constructor(
    @Inject(MAIL_SERVICE) private readonly mailService: MailService,
    private readonly configService: ConfigService
  ) {
    this.adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    this.stimulusEmail = this.configService.get<string>('STIMULUS_EMAIL');
    this.clientAppUrl = this.configService.get<string>('CLIENT_APP_URL');
    this.newClientAppUrl = this.configService.get<string>('NEW_CLIENT_APP_URL');
  }

  async sendUserProvisionedEmailAdmin(stimulusUser: User, externalUser: any): Promise<any> {
    return this.mailService.send({
      to: this.adminEmail,
      from: this.stimulusEmail,
      subject: 'Stimulus user provisioned',
      html: `<p> ${JSON.stringify(stimulusUser)} </p><p>${JSON.stringify(externalUser)}</p>`,
    });
  }
  async sendUserRequestedAccessEmailAdmin(user: User) {
    return this.mailService.send({
      to: this.adminEmail,
      from: this.stimulusEmail,
      subject: 'Stimulus user access request',
      html: `<p> ${JSON.stringify(user)} </p>`,
    });
  }
  async sendUserTenantInvitationEmail(user: User, tenant: Tenant) {
    const templateId = this.configService.get<string>('EMAIL_USER_TENANT_INVITATION_TEMPLATE_ID');
    return this.mailService.send({
      from: this.stimulusEmail,
      to: user.email,
      templateId,
      dynamicTemplateData: {
        tenantName: tenant.name,
        userEmail: user.email,
        clientAppUrl: this.clientAppUrl,
      },
    });
  }
  async sendNewUserTenantInvitationEmail(user: User, tenant: Tenant) {
    const templateId = this.configService.get<string>('EMAIL_NEW_USER_TENANT_INVITATION_TEMPLATE_ID');
    return this.mailService.send({
      to: user.email,
      from: this.stimulusEmail,
      templateId,
      dynamicTemplateData: {
        tenantName: tenant.name,
        userEmail: user.email,
        clientAppUrl: this.newClientAppUrl,
      },
    });
  }
}
