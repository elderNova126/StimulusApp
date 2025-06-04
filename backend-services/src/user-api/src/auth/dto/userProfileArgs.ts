import { ArgsType, Field } from '@nestjs/graphql';
import { Min } from 'class-validator';

@ArgsType()
export class UserIdentifierArgs {
  @Field({ nullable: true })
  externalAuthSystemId?: string;
}

@ArgsType()
export class UserProfileArgs extends UserIdentifierArgs {
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
export class FindByNameArgs {
  @Field({ nullable: true })
  @Min(4, { message: 'Search term must be at least 4 characters long' })
  surname?: string;
}
@ArgsType()
export class TopicCategoryArgs {
  @Field({ nullable: true })
  category: string;
}
@ArgsType()
export class UserNotificationArgs {
  @Field(() => [Number], { nullable: true })
  projectIds?: number[];

  @Field(() => [String], { nullable: true })
  companyIds?: string[];

  @Field(() => [String], { nullable: true })
  projectCompanyIds?: string[];
}

@ArgsType()
export class InviteUserArgs {
  @Field()
  email: string;

  @Field({ nullable: true })
  resend?: boolean;
}
