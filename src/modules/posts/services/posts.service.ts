import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { FindOptions } from '@/common/types/mongoose.type';

import { PostsMongodbRepository } from '../repositories/posts.mongodb.repository';
import { PostDocument } from '../schemas/posts.schema';
import { WritePostDto } from '../dtos/create-post.dto';
import { PostsViewCountRedisRepository } from '../repositories/posts-view-count.redis.repository';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsMongodbRepository: PostsMongodbRepository,
    private readonly postsViewCountRedisRepository: PostsViewCountRedisRepository,
  ) {}

  async getPost(postId: ObjectId) {
    return this.postsMongodbRepository.findById(postId);
  }

  async getPosts(findOptions: FindOptions<PostDocument>) {
    return this.postsMongodbRepository.findAll(findOptions);
  }

  async writePost(writePostDto: WritePostDto & { userId: ObjectId }) {
    return this.postsMongodbRepository.create(writePostDto);
  }

  async getPostTagCount(): Promise<any> {
    return this.postsMongodbRepository.findAllTagsWithCount();
  }

  async hasViewHistory(postId: string, userCookie: string) {
    return this.postsViewCountRedisRepository.hasViewHistory(postId, userCookie);
  }

  async writePostViewCountHistory(postId: string, userCookie: string) {
    return this.postsViewCountRedisRepository.writePostViewCountHistory(postId, userCookie);
  }

  async increasePostViewCount(postId: ObjectId, userCookie: string) {
    await this.writePostViewCountHistory(postId.toString(), userCookie);

    return this.postsMongodbRepository.increasePostViewCount(postId);
  }
}
