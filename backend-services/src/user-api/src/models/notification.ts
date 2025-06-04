import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { ErrorResponse } from './baseResponse';
import { Event } from './event';

@ObjectType()
export class Notification {
  @Field()
  id?: string;

  @Field({ nullable: true })
  created: string;

  @Field({ nullable: true })
  read: boolean;

  @Field({ nullable: true })
  event: Event;
}

@ObjectType()
export class NotificationResponse {
  @Field(() => [Notification], { nullable: true })
  results: Notification[];
  @Field({ nullable: true })
  count: number;
}

export const NotificationUnion = createUnionType({
  name: 'NotificationUnion',
  types: () => [Notification, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return Notification;
  },
});

export const NotificationResponseUnion = createUnionType({
  name: 'NotificationResponseUnion',
  types: () => [NotificationResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return NotificationResponse;
  },
});
