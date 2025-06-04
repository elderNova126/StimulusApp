import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { EventService } from '../event/event.service';

@Module({
  imports: [UserProfileModule],
  providers: [NotificationService, EventService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
