import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Post, PostMongooseSchema } from './schemas/posts.schema';
import { PostsMongodbRepository } from './repositories/posts.mongodb.repository';
import { PostsService } from './services/posts.service';
import { PostsResolver } from './resolvers/posts.resolver';
import { PostTagsResolver } from './resolvers/post-tags.resolver';

@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostMongooseSchema }])],
  providers: [PostsMongodbRepository, PostsService, PostsResolver, PostTagsResolver],
})
export class PostsModule {}
