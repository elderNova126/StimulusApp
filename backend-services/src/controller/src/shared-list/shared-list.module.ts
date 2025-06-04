import { Module } from '@nestjs/common';
import { CompanyListService } from 'src/company-list/company-list.service';
import { EventModule } from 'src/event/event.module';
import { UserModule } from '../user/user.module';
import { SharedListController } from './shared-list.controller';
import { SharedListService } from './shared-list.service';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [UserModule, EventModule],
  providers: [SharedListService, CompanyListService, EmailService],
  controllers: [SharedListController],
})
export class SharedListModule {}
