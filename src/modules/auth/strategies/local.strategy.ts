import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { AppClsStore } from '@/common/types/cls.type';
import { ClsStoreKey } from '@/common/constants/cls.constant';

import { AuthService } from '../services/auth.service';
import { CryptoService } from '../services/crypto.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly cryptoService: CryptoService,
    private readonly clsService: ClsService<AppClsStore>,
  ) {
    super({
      usernameField: 'userId',
      passwordField: 'password',
    });
  }

  async validate(userId: string, password: string) {
    const user = await this.authService.validateUser(
      this.cryptoService.decryptAES(userId),
      this.cryptoService.decryptAES(password),
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    this.clsService.set(ClsStoreKey.USER_ID, user._id);

    return { id: user._id };
  }
}
