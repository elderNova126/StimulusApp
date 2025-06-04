import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { InternalEventService } from './internal-event.service';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [UserModule, NotificationModule],
  controllers: [EventController],
  providers: [EventService, InternalEventService],
  exports: [EventService, InternalEventService],
})
export class EventModule {}
