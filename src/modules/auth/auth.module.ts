import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { UsersModule } from '@/modules/users/users.module';

import { AuthService } from './services/auth.service';
import { CryptoService } from './services/crypto.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AccessJwtStrategy, ExpiredAccessJwtStrategy, RefreshJwtStrategy } from './strategies/jwt-auth.strategy';
import { AuthResolver } from './resolvers/auth.resolver';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.jwt.secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    CryptoService,
    LocalStrategy,
    AccessJwtStrategy,
    ExpiredAccessJwtStrategy,
    RefreshJwtStrategy,
    AuthResolver,
  ],
})
export class AuthModule {}
