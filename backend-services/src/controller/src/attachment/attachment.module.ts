import { Module } from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [AttachmentService],
  controllers: [AttachmentController],
})
export class AttachmentModule {}
