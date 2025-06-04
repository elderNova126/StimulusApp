import { Controller } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Notification } from '../notification/notification.entity';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @GrpcMethod('DataService', 'GetNotifications')
  async getNotifications(data: any): Promise<{ results: Notification[]; count: number }> {
    const [results, count] = await this.notificationService.getNotifications(data);

    return { results, count };
  }

  @GrpcMethod('DataService', 'ReadNotification')
  async readNotification(data: any): Promise<Notification> {
    const {
      userId,
      notification: { id, read },
    } = data;
    return this.notificationService.readNotification(id, read, userId);
  }
}
