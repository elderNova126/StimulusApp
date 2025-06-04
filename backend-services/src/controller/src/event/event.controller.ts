import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { EventService } from './event.service';
import { Event } from './event.entity';
import { UserService } from '../user/user.service';
import { StimulusLogger } from '../logging/stimulus-logger.service';
import { EventCode } from './event-code.enum';

@Controller('event')
export class EventController {
  constructor(
    private eventService: EventService,
    private userService: UserService,
    private readonly logger: StimulusLogger
  ) {
    this.logger.context = EventController.name;
  }

  @GrpcMethod('DataService', 'SearchEvents')
  async searchEvents(data: any): Promise<{ results: Event[]; count: number }> {
    const { pagination, notUserId, fromTimestamp, toTimestamp, companyId, projectId, userId, event } = data;
    const [results, count] = await this.eventService.getEvents(event, pagination, {
      notUserId,
      fromTimestamp,
      toTimestamp,
      companyId,
      projectId,
      userId,
    });

    return { results, count } as { results: Event[]; count: number };
  }

  @GrpcMethod('DataService', 'GetProjectActivityLog')
  async getProjectActivityLog(data: any): Promise<{ results: Event[]; count: number }> {
    const {
      pagination,
      projectPayload: {
        project: { id: projectId },
      },
      userId,
      order,
    } = data;
    let finalEvents = [];
    const [results, count] = await this.eventService.getProjectEvents(projectId, pagination, order, userId);

    if (count > 0) {
      const userIds = [...new Set(results.map((event) => event.userId).filter((i) => i))]; // remove duplicate ids to minimize AD calls
      try {
        const { value: users } = await this.userService.getADUsersByExternalIds(userIds);
        finalEvents = results.map((event) => {
          const user = users.find((userObj) => userObj.id === event.userId);
          return { ...event, userName: `${user?.givenName ?? ''} ${user?.surname ?? ''}` };
        });

        finalEvents = finalEvents.filter((event, index, self) => {
          if (event.code === EventCode.ANSWER_PROJECT_COMPANY_CRITERIA) {
            return (
              self.findIndex(
                (t) => t.meta.answers === event.meta.answers && t.meta.companyId === event.meta.companyId
              ) === index
            );
          }
          return true;
        });
      } catch (error) {
        this.logger.error(`Failed to get AD users error: `, error);
      }
    }
    return { results: finalEvents, count: finalEvents.length };
  }

  @GrpcMethod('DataService', 'GetCompanyActivityLog')
  async getCompanyActivityLog(data: any): Promise<{ results: Event[]; count: number }> {
    const {
      pagination,
      company: { id },
      order,
    } = data;

    const [results, count] = await this.eventService.getCompanyEvents(id, pagination, order);

    let finalEvents = [];
    const userIds = [...new Set(results.map((event) => event.userId).filter((i) => i))]; // remove duplicate ids to minimize AD calls
    try {
      const { value: users } = await this.userService.getADUsersByExternalIds(userIds);

      finalEvents = results.map((event) => {
        const user = users.find((userObj) => userObj.id === event.userId);

        return { ...event, userName: `${user?.givenName ?? ''} ${user?.surname ?? ''}` };
      });
    } catch (error) {
      this.logger.error(`Failed to get AD users error: `, error);
    }
    return { results: finalEvents, count };
  }

  @GrpcMethod('DataService', 'CreateEvent')
  async createEvent(data: any): Promise<Event> {
    return this.eventService.createEvent(data);
  }

  @GrpcMethod('DataService', 'DeleteEvent')
  async deleteEvent(data: any): Promise<any> {
    const { id } = data;
    const res = await this.eventService.deleteEvent(id);

    return { done: res.affected > 0 };
  }
}
