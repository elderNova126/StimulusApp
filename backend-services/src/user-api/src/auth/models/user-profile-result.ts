import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UsersProfileResult {
  @Field(() => [UserProfileResult], { nullable: true })
  results: UserProfileResult[];
  @Field({ nullable: true })
  count: number;
}

@ObjectType()
export class CollaboratorsResult {
  @Field(() => [CollaboratorResult], { nullable: true })
  results: CollaboratorResult[];
  @Field({ nullable: true })
  count: number;
}

@ObjectType()
export class UserProfileResult {
  constructor(id: string, tenant?: string) {
    this.id = id;
    this.tenant = tenant;
  }

  @Field()
  id: string;

  @Field({ nullable: true })
  externalAuthSystemId?: string;

  @Field({ nullable: true })
  tenant?: string;

  @Field({ nullable: true })
  givenName?: string;

  @Field({ nullable: true })
  surname?: string;

  @Field({ nullable: true })
  mail?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field({ nullable: true })
  mobilePhone?: string;

  @Field({ nullable: true })
  accountEnabled?: boolean;
}

@ArgsType()
export class UserSearchArgs {
  @Field({ nullable: true })
  page?: number;
  @Field({ nullable: true })
  limit?: number;
  @Field({ nullable: true })
  orderBy?: string;
  @Field({ nullable: true })
  direction?: string;
  @Field({ nullable: true })
  typeOfList?: string;
}

@ObjectType()
export class UsersResult {
  @Field(() => [UserProfileResult], { nullable: true })
  results: UserProfileResult[];
  @Field({ nullable: true })
  count: number;
}

@ObjectType()
export class CollaboratorResult {
  constructor(id: string) {
    this.id = id;
  }

  @Field()
  id: string;

  @Field({ nullable: true })
  externalAuthSystemId?: string;

  @Field({ nullable: true })
  givenName?: string;

  @Field({ nullable: true })
  surname?: string;

  @Field({ nullable: true })
  jobTitle?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  sharedListId?: string;
}

@ObjectType()
export class UserNotificationResult {
  @Field()
  id: string;

  @Field(() => [String], { nullable: true })
  subscribedProjects: string[];

  @Field(() => [String], { nullable: true })
  subscribedCompanies: string[];

  @Field(() => [String], { nullable: true })
  subscribedProjectCompanies: string[];
}
