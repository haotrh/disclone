import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { EnvironmentVariables } from 'src/interfaces/env.interface';

@Injectable()
export class FileService {
  private s3: S3;

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadToS3(fileName: string, body: S3.Body) {
    const params: S3.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: body,
      ACL: 'public-read',
    };

    const { Location } = await this.s3.upload(params).promise();

    return Location;
  }
}
