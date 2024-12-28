import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import FileUpload from 'graphql-upload/Upload.mjs';

@Injectable()
export class ImagesUploadService {
  private readonly s3Client: AWS.S3;
  private readonly bucketName: string;
  private readonly baseFolderPath = 'assets/';

  constructor(private readonly configService: ConfigService) {
    const { bucketName, region, url, accessKey, secretKey } = configService.get('image-upload');

    this.bucketName = bucketName;
    this.s3Client = new AWS.S3({
      endpoint: url,
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });
  }

  async upload(fileData: Promise<FileUpload['file']>) {
    const { createReadStream, mimetype, filename } = await fileData;
    const uploadName = `${+new Date()}${filename}`;

    const { Location } = await this.s3Client
      .upload({
        Bucket: this.bucketName,
        Key: `${this.baseFolderPath}${uploadName}`,
        ACL: 'public-read',
        Body: createReadStream(),
        ContentType: mimetype,
      })
      .promise();

    return Location;
  }
}
