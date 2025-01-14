import { Resolver, Query, Mutation, Directive, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { FilterQuery, SortOrder } from 'mongoose';
import { ObjectId } from 'mongodb';
import { ClsService } from 'nestjs-cls';
import { UseGuards } from '@nestjs/common';

import { AllowKeysValidationPipe } from '@/common/pipes/allow-keys.validate.pipe';
import { InputFilter } from '@/common/schemas/filter-graphql.schema';
import { InputSort } from '@/common/schemas/sort-graphql.schema';
import { ObjectIdScalar } from '@/common/graphql/scalars/mongo-object-id.scalar';
import { AppClsStore } from '@/common/types/cls.type';
import { ClsStoreKey } from '@/common/constants/cls.constant';
import { UserDto } from '@/modules/users/dtos/user.dto';
import { UsersService } from '@/modules/users/services/users.service';
import { USER_COOKIE } from '@/common/constants/cookie.constant';
import { AccessJwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

import { PostsService } from '../services/posts.service';
import { Post, PostConnection } from '../schemas/posts.schema';
import { PostDocument } from '../schemas/posts.schema';
import { WritePostDto } from '../dtos/create-post.dto';
import { EditPostDto } from '../dtos/edit-post.dto';

@Resolver(() => Post)
export class PostsResolver {
  private static ALLOW_FILTER_KEY = ['_id', 'title', 'content', 'numId', 'category', 'tags', 'pickedAt'];
  private static ALLOW_SORT_KEY = ['_id', 'numId', 'tags', 'createdAt', 'pickedAt'];

  constructor(
    private readonly postsService: PostsService,
    private readonly usersSerivce: UsersService,
    private readonly clsService: ClsService<AppClsStore>,
  ) {}

  @Query(() => Post)
  async post(@Args('id', { type: () => ObjectIdScalar }) _id: ObjectId) {
    return this.postsService.getPost(_id);
  }

  @Directive('@filterConvert')
  @Directive('@sortConvert')
  @Query(() => PostConnection)
  async posts(
    @Args(
      'filter',
      { type: () => [InputFilter], nullable: true },
      AllowKeysValidationPipe(PostsResolver.ALLOW_FILTER_KEY),
    )
    filter?: FilterQuery<PostDocument>,
    @Args('skip', { type: () => Int, nullable: true }) skip: number = 0,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('sort', { type: () => [InputSort], nullable: true }, AllowKeysValidationPipe(PostsResolver.ALLOW_SORT_KEY))
    sort?: { [key: string]: SortOrder },
  ) {
    const { results: nodes, totalCount } = await this.postsService.getPosts({ filter, skip, limit, sort });

    return {
      nodes,
      totalCount,
      pageInfo: {
        hasNext: skip + nodes.length < totalCount,
      },
    };
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => Post)
  async writePost(@Args('writePostDto') writePostDto: WritePostDto) {
    const userId = this.clsService.get(ClsStoreKey.USER_ID);

    return this.postsService.writePost({ ...writePostDto, userId });
  }

  @UseGuards(AccessJwtAuthGuard)
  @Mutation(() => Post)
  async editPost(@Args('editPostDto') { _id, ...editPostDto }: EditPostDto) {
    const userId = this.clsService.get(ClsStoreKey.USER_ID);

    return this.postsService.editPost(editPostDto, { _id, userId });
  }

  @Mutation(() => Post, { nullable: true })
  async increasePostViewCount(@Args('postId', { type: () => ObjectIdScalar }) postId: ObjectId) {
    const request = this.clsService.get(ClsStoreKey.REQUEST);
    const userCookie = request.cookies?.[USER_COOKIE];

    if (!userCookie) {
      return null;
    }

    const canNotIncreasePostView = await this.postsService.hasViewHistory(postId.toString(), userCookie);

    if (canNotIncreasePostView) {
      return null;
    }

    return this.postsService.increasePostViewCount(postId, userCookie);
  }

  @ResolveField(() => UserDto)
  async user(@Parent() post: Post) {
    return this.usersSerivce.getUserById(post.userId);
  }
}
