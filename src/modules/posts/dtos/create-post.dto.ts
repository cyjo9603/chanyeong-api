import { InputType, PickType } from '@nestjs/graphql';

import { Post } from '../schemas/posts.schema';

@InputType('WritePostDto')
export class WritePostDto extends PickType(Post, ['category', 'title', 'content', 'thumbnail', 'tags'] as const) {}
