import { ArgsType, Field } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';

@ArgsType()
export class LoginDto {
  @MaxLength(200)
  @Field(() => String)
  userId: string;

  @MaxLength(200)
  @Field(() => String)
  password: string;
}
