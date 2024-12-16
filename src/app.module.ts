import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ClsModule } from 'nestjs-cls';

import configuration from '../config/configuration';
import { AppController } from './app.controller';
import { AppHealthIndicator } from './app.health';

@Module({
  imports: [
    TerminusModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppHealthIndicator],
})
export class AppModule {}
