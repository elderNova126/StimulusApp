import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { CompanyAttachmentService } from './company-attachment.service';
import { CompanyAttachmentController } from './company-attachment.controller';

@Module({
  imports: [UserModule],
  providers: [CompanyAttachmentService],
  controllers: [CompanyAttachmentController],
})
export class CompanyAttachmentModule {}
