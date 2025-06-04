import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class TracingArgs {
  @Field({ nullable: true })
  dataTraceSource?: string;
  @Field({ nullable: true })
  traceFrom?: string;
}
