import { ObjectType, Field, Int } from '@nestjs/graphql';

import { UserDto } from '@/modules/users/dtos/user.dto';

@ObjectType()
export class RefreshDto {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => Int)
  maxAge: number;

  @Field(() => UserDto)
  me: UserDto;
}
