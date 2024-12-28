import { Module } from '@nestjs/common';

import { ImagesUploadService } from './services/images-upload.service';
import { ImagesUploadResolver } from './resolvers/images-upload.resolver';

@Module({
  imports: [],
  providers: [ImagesUploadService, ImagesUploadResolver],
})
export class ImagesModule {}
