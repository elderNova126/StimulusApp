import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Role {
  @Field()
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  internal: boolean;

  @Field({ nullable: true })
  description: string;
}
