import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ObjectId } from 'mongodb';
import { ClsService } from 'nestjs-cls';

import { AppClsStore } from '@/common/types/cls.type';
import { ClsStoreKey } from '@/common/constants/cls.constant';
import { UsersService } from '@/modules/users/services/users.service';

import { JwtTokenType } from '../constants/token.constant';
import { UserJwtToken } from '../types/token.type';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  private JWT_ACCESS_EXPIRES: string;
  private JWT_REFRESH_EXPIRES: string;
  private ACCESS_TOKEN_HEADER_NAME: string;
  private REFRESH_TOKEN_HEADER_NAME: string;
  public COOKIE_MAX_AGE: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly clsService: ClsService<AppClsStore>,
  ) {
    this.JWT_ACCESS_EXPIRES = configService.get('auth.jwt.expires.access');
    this.JWT_REFRESH_EXPIRES = configService.get('auth.jwt.expires.refresh');
    this.ACCESS_TOKEN_HEADER_NAME = configService.get('auth.cookie.name.access');
    this.REFRESH_TOKEN_HEADER_NAME = configService.get('auth.cookie.name.refresh');
    this.COOKIE_MAX_AGE = configService.get('auth.cookie.maxAge');
  }

  async validateUser(userId: string, password: string) {
    const user = await this.usersService.getUserByUserId(userId);

    const isCompared = this.cryptoService.compareHash(password, user.password);

    if (!isCompared || !user) {
      return null;
    }

    return user;
  }

  async signIn(payload: UserJwtToken) {
    const accessToken = this.createAndSetToken(JwtTokenType.ACCESS, payload);
    const refreshToken = this.createAndSetToken(JwtTokenType.REFRESH, payload);

    const user = await this.usersService.updateRefreshToken(new ObjectId(payload.id), refreshToken);

    return { accessToken, refreshToken, user };
  }

  private createAndSetToken(type: JwtTokenType, payload: UserJwtToken) {
    const tokenName = type === JwtTokenType.ACCESS ? this.ACCESS_TOKEN_HEADER_NAME : this.REFRESH_TOKEN_HEADER_NAME;
    const expires = type === JwtTokenType.ACCESS ? this.JWT_ACCESS_EXPIRES : this.JWT_REFRESH_EXPIRES;

    const token = this.jwtService.sign({ ...payload, type }, { expiresIn: expires });

    const res = this.clsService.get(ClsStoreKey.RESPONSE);

    res.cookie(tokenName, token, { secure: true, maxAge: this.COOKIE_MAX_AGE });

    return token;
  }

  async logout(id: ObjectId) {
    const user = await this.usersService.updateRefreshToken(id, null);

    this.clearCookieToken();

    return user;
  }

  private clearCookieToken() {
    const res = this.clsService.get(ClsStoreKey.RESPONSE);

    res.clearCookie(this.ACCESS_TOKEN_HEADER_NAME);
    res.clearCookie(this.REFRESH_TOKEN_HEADER_NAME);
  }
}
