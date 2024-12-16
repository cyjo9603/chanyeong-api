import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { ClsModule } from 'nestjs-cls';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ObjectId } from 'mongodb';

import { AppController } from '@/app.controller';
import { AppHealthIndicator } from '@/app.health';
import { ClsStoreKey } from '@/common/constants/cls.constant';

import { UsersModule } from '@/modules/users/users.module';

import configuration from '../config/configuration';
import { ObjectIdScalar } from './common/graphql/scalars/mongo-object-id.scalar';
import { DateTimeScalar } from './common/graphql/scalars/date-time.scalar';

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
        setup: (cls) => {
          cls.set(ClsStoreKey.DATA_LOADERS, {});
        },
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
        definitions: {
          customScalarTypeMapping: {
            DateTime: 'Date',
            ObjectId,
          },
          additionalHeader: "import { ObjectId } from 'mongodb'",
        },
      }),

      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppHealthIndicator, ObjectIdScalar, DateTimeScalar],
})
export class AppModule {}
