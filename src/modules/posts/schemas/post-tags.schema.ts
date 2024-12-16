import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PostTag {
  @Field(() => Int)
  count: number;

  @Field(() => String)
  name: string;
}
