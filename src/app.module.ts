import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ClsModule } from 'nestjs-cls';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('db.service.connection.uri'),
        autoCreate: true,
        autoIndex: false,
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        debug: false,
        playground: configService.get('appEnv') === 'development',
        autoSchemaFile: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppHealthIndicator],
})
export class AppModule {}
