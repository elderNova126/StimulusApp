import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ScopeContextResult {
  @Field()
  token: string;
}
