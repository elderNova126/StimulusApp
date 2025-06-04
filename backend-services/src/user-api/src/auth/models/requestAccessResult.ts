import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RequestAccessResult {
  @Field()
  success: boolean;
}
