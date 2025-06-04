import { Field, ObjectType, createUnionType } from '@nestjs/graphql';
import { UserProfileResult } from '../auth/models/user-profile-result';
import { ErrorResponse } from './baseResponse';

@ObjectType()
class UpdatesMeta {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  from: string;
  @Field({ nullable: true })
  to: string;
}
@ObjectType()
export class EventMeta {
  @Field({ nullable: true })
  id: string;
  @Field({ nullable: true })
  companyId: string;
  @Field({ nullable: true })
  projectId: string;
  @Field({ nullable: true })
  listName: string;
  @Field({ nullable: true })
  listId: string;
  @Field({ nullable: true })
  userInvited: string;
  @Field({ nullable: true })
  departmentId: string;
  @Field({ nullable: true })
  companyName: string;
  @Field({ nullable: true })
  projectName: string;
  @Field({ nullable: true })
  departmentName: string;
  @Field({ nullable: true })
  actionType: string;
  @Field({ nullable: true })
  status: string;
  @Field({ nullable: true })
  type: string;
  @Field(() => [UpdatesMeta], { nullable: true })
  updates: UpdatesMeta[];
  @Field({ nullable: true })
  settingValue: boolean;
  @Field({ nullable: true })
  setting: string;
  @Field({ nullable: true })
  answers: string;
  @Field({ nullable: true })
  userName: string;
}
@ObjectType()
export class Event {
  @Field()
  id: number;
  @Field()
  created: string;
  @Field({ nullable: true })
  body: string;
  @Field({ nullable: true })
  meta: EventMeta;
  @Field()
  code: string;
  @Field()
  level: string;
  @Field({ nullable: true })
  entityType: string;
  @Field({ nullable: true })
  userId: string;
  @Field({ nullable: true })
  userName: string;
  @Field({ nullable: true })
  user: UserProfileResult;
  @Field({ nullable: true })
  entityId: string;
}

@ObjectType()
export class EventsResponse {
  @Field(() => [Event], { nullable: true })
  results: Event[];
  @Field({ nullable: true })
  count: number;
}

export const EventsResponseUnion = createUnionType({
  name: 'EventsResponseUnion',
  types: () => [EventsResponse, ErrorResponse],
  resolveType(value) {
    if (value?.error) {
      return ErrorResponse;
    }
    return EventsResponse;
  },
});
