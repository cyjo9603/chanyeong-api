import { Resolver, Mutation, Args } from '@nestjs/graphql';
import FileUpload from 'graphql-upload/Upload.mjs';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

import { ImagesUploadService } from '../services/images-upload.service';

@Resolver(() => String)
export class ImagesUploadResolver {
  constructor(private readonly imagesUploadService: ImagesUploadService) {}

  @Mutation(() => String)
  async uploadImage(@Args('fileData', { type: () => GraphQLUpload }) fileData: FileUpload['file']) {
    return this.imagesUploadService.upload(fileData as unknown as Promise<FileUpload['file']>);
  }
}
