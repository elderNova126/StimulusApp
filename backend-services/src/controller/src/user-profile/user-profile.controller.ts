import { Controller } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('user-profile')
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @GrpcMethod('DataService', 'GetUserNotificationProfile')
  getUserNotificationProfile(data: any) {
    const { userId } = data;
    return this.userProfileService.getUserProfile(userId);
  }

  @GrpcMethod('DataService', 'SubscribeToTopic')
  subscribeToTopic(data: any) {
    return this.userProfileService.subscribeToTopic(data);
  }

  @GrpcMethod('DataService', 'UnsubscribeFromTopic')
  async unsubscribeFromTopic(data: any) {
    return this.userProfileService.unsubscribeFromTopic(data);
  }

  @GrpcMethod('DataService', 'SubscribeToCategoryTopic')
  subscribeToCategoryTopic(data: any) {
    return this.userProfileService.subscribeToCategoryTopic(data.category);
  }

  @GrpcMethod('DataService', 'UnsubscribeFromCategoryTopic')
  async unsubscribeFromCategoryTopic(data: any) {
    return this.userProfileService.unsubscribeFromCategoryTopic(data.category);
  }
}
