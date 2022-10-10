import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import ImageService from './image.service';

@Module({
  providers: [FileService, ImageService],
  exports: [FileService, ImageService],
})
export class FileModule {}
