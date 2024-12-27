import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class RefreshDto {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}
