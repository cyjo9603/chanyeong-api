import { InputType, PickType } from '@nestjs/graphql';

import { Post } from '../schemas/posts.schema';

@InputType('EditPostDto')
export class EditPostDto extends PickType(Post, [
  '_id',
  'category',
  'title',
  'content',
  'thumbnail',
  'tags',
] as const) {}
