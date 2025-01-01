import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from '@/modules/users/users.module';

import { Post, PostMongooseSchema } from './schemas/posts.schema';
import { PostsMongodbRepository } from './repositories/posts.mongodb.repository';
import { PostsService } from './services/posts.service';
import { PostsResolver } from './resolvers/posts.resolver';
import { PostTagsResolver } from './resolvers/post-tags.resolver';
import { PostsViewCountRedisRepository } from './repositories/posts-view-count.redis.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostMongooseSchema }]),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        config: {
          host: configService.get<string>('redis.uri'),
          port: configService.get<number>('redis.port'),
          username: configService.get<string>('redis.username'),
          password: configService.get<string>('redis.password'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [PostsMongodbRepository, PostsViewCountRedisRepository, PostsService, PostsResolver, PostTagsResolver],
})
export class PostsModule {}
