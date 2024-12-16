import { Resolver, Query, Directive, Args, Int } from '@nestjs/graphql';
import { FilterQuery, SortOrder } from 'mongoose';

import { AllowKeysValidationPipe } from '@/common/pipes/allow-keys.validate.pipe';
import { InputFilter } from '@/common/schemas/filter-graphql.schema';
import { InputSort } from '@/common/schemas/sort-graphql.schema';

import { PostsService } from '../services/posts.service';
import { Post, PostConnection } from '../schemas/posts.schema';
import { PostDocument } from '../schemas/posts.schema';

@Resolver(() => Post)
export class PostsResolver {
  private static ALLOW_FILTER_KEY = ['_id', 'title', 'content', 'numId', 'category', 'tags', 'pickedAt'];
  private static ALLOW_SORT_KEY = ['_id', 'numId', 'tags', 'createdAt', 'pickedAt'];

  constructor(private readonly postsService: PostsService) {}

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
}
