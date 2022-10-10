import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import FilePath from 'src/utils/file-path.util';
import {
  avatarSize,
  bannerSize,
  emojiSize,
  serverIconSize,
  serverSplashSize,
} from 'src/utils/image.util';
import { FileService } from './file.service';

@Injectable()
export class ImageService {
  constructor(private fileService: FileService) {}

  getBase64ImageData(base64: string) {
    const [mediaType, data] = base64.split(';base64,');
    const imageFileExtension = mediaType.replace('data:image/', '');
    return [data, imageFileExtension];
  }

  async uploadBase64Image(
    base64: string,
    fileName: string,
    width: number,
    height: number,
    customFormat?: keyof sharp.FormatEnum | sharp.AvailableFormatInfo,
  ) {
    const [data, imageFileExtension] = this.getBase64ImageData(base64);
    let transformImage = sharp(Buffer.from(data, 'base64'), {
      animated: true,
    }).resize(width, height, { fit: 'contain', background: 'transparent' });
    if (customFormat) {
      transformImage = transformImage.toFormat(customFormat);
    }
    const buffer = await transformImage.toBuffer();
    const fileNameWithExtension =
      fileName + '.' + customFormat ?? imageFileExtension;
    await this.fileService.uploadToS3(fileNameWithExtension, buffer);
    return FilePath.imageKitFilePath(fileNameWithExtension).replace(
      / /g,
      '%20',
    );
  }

  public async uploadServerIcon(base64: string, serverId: string) {
    return this.uploadBase64Image(
      base64,
      FilePath.serverIcon(serverId),
      ...serverIconSize,
    );
  }

  public async uploadServerSplash(base64: string, serverId: string) {
    return this.uploadBase64Image(
      base64,
      FilePath.serverSplash(serverId),
      ...serverSplashSize,
    );
  }

  public async uploadUserAvatar(base64: string, userId: string) {
    return this.uploadBase64Image(
      base64,
      FilePath.userAvatar(userId),
      ...avatarSize,
    );
  }

  public async uploadUserBanner(base64: string, userId: string) {
    return this.uploadBase64Image(
      base64,
      FilePath.userBanner(userId),
      ...bannerSize,
    );
  }

  public async uploadMemberAvatar(
    base64: string,
    userId: string,
    serverId: string,
  ) {
    return this.uploadBase64Image(
      base64,
      FilePath.memberAvatar(userId, serverId),
      ...avatarSize,
    );
  }

  public async uploadMemberBanner(
    base64: string,
    userId: string,
    serverId: string,
  ) {
    return this.uploadBase64Image(
      base64,
      FilePath.memberBanner(userId, serverId),
      ...bannerSize,
    );
  }

  public async uploadEmoji(base64: string, emojiId: string) {
    return this.uploadBase64Image(
      base64,
      FilePath.emoji(emojiId),
      emojiSize[0],
      emojiSize[1],
      'png',
    );
  }
}

export default ImageService;
