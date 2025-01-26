import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { FindOptions } from '@/common/types/mongoose.type';

import { PostsMongodbRepository } from '../repositories/posts.mongodb.repository';
import { PostDocument } from '../schemas/posts.schema';
import { WritePostDto } from '../dtos/create-post.dto';
import { PostsViewCountRedisRepository } from '../repositories/posts-view-count.redis.repository';
import { EditPostDto } from '../dtos/edit-post.dto';
import { PostCategory } from '../constants/post.constant';

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

  async editPost(editPostDto: Omit<EditPostDto, '_id'>, findOptions: { _id: ObjectId; userId: ObjectId }) {
    return this.postsMongodbRepository.updateOne(findOptions, editPostDto);
  }

  async getPostTagCount(category?: PostCategory): Promise<any> {
    return this.postsMongodbRepository.findAllTagsWithCount(category);
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

  async getAllPostIds() {
    const ids = await this.postsMongodbRepository.findAllOnlyIds();

    return ids.map(({ _id }) => _id);
  }
}
