import { uuid } from 'short-uuid';

class FilePath {
  public static serverIcon(serverId: string) {
    return `icons/${serverId}/${uuid()}`;
  }

  public static serverSplash(serverId: string) {
    return `splashes/${serverId}/${uuid()}`;
  }

  public static userAvatar(userId: string) {
    return `avatars/${userId}/${uuid()}`;
  }

  public static userBanner(userId: string) {
    return `banners/${userId}/${uuid()}`;
  }

  public static memberAvatar(userId: string, serverId: string) {
    return `servers/${serverId}/users/${userId}/avatars/${uuid()}`;
  }

  public static memberBanner(userId: string, serverId: string) {
    return `servers/${serverId}/users/${userId}/banners/${uuid()}`;
  }

  public static emoji(fileName: string) {
    return `emojis/${fileName}`;
  }

  public static sticker(fileName: string) {
    return `stickers/${fileName}`;
  }

  public static imageKitFilePath(fileName: string) {
    return `https://ik.imagekit.io/disclone123/${fileName}`;
  }
}

export default FilePath;
