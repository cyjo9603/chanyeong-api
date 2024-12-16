import { JwtTokenType } from '../constants/token.constant';

export interface UserJwtToken {
  id: string;
  type?: JwtTokenType;
}
