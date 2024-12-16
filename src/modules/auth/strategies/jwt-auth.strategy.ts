import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';
import { ClsService } from 'nestjs-cls';

import { AppClsStore } from '@/common/types/cls.type';
import { ClsStoreKey } from '@/common/constants/cls.constant';

import { UserJwtToken } from '../types/token.type';
import { JwtTokenType } from '../constants/token.constant';

interface GenerateJwtStrategyOptions {
  type: JwtTokenType;
  name?: string;
  strategyOptions?: Omit<StrategyOptions, 'jwtFromRequest' | 'secretOrKey'>;
}

const generateJwtStrategy = ({ type, name, strategyOptions = {} }: GenerateJwtStrategyOptions): Type<Strategy> => {
  @Injectable()
  class JwtStrategy extends PassportStrategy(Strategy, name || `jwt-${type}`) {
    constructor(
      private readonly configService: ConfigService,
      private readonly clsService: ClsService<AppClsStore>,
    ) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: configService.get<string>('auth.jwt.secret'),
        ...strategyOptions,
      });
    }

    validate(payload: UserJwtToken) {
      if (payload.type !== type) {
        throw new UnauthorizedException();
      }

      this.clsService.set(ClsStoreKey.USER_ID, new ObjectId(payload.id));

      return { id: new ObjectId(payload.id) };
    }
  }

  return JwtStrategy;
};

export const AccessJwtStrategy = generateJwtStrategy({ type: JwtTokenType.ACCESS });
export const ExpiredAccessJwtStrategy = generateJwtStrategy({
  type: JwtTokenType.ACCESS,
  name: 'expired-access-jwt',
  strategyOptions: { ignoreExpiration: true },
});
export const RefreshJwtStrategy = generateJwtStrategy({ type: JwtTokenType.REFRESH });
