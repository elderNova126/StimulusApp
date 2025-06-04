import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Metric {
  @Field()
  id: string;
  @Field()
  category: string;
  @Field()
  question: string;
  @Field({ nullable: true })
  exceptionalValue: number;
  @Field({ nullable: true })
  metExpectationsValue: number;
  @Field({ nullable: true })
  unsatisfactoryValue: number;
  @Field({ nullable: true })
  keyId: string;
  @Field()
  isDefault: boolean;
}
