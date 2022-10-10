import { LIMIT_MESSAGES_PER_API_CALL } from "types/api.interfaces";
import { ChannelType } from "types/channel";
import { Message } from "types/message";
import api from "./api";

export class ChannelService {
  static createChannel(
    serverId: string,
    data: {
      name: string;
      isPrivate?: boolean;
      parentId?: string;
      type: ChannelType;
    }
  ) {
    return api.post(`servers/${serverId}/channels`, data);
  }

  static pinMessage(channelId: string, messageId: string) {
    return api.put(`channels/${channelId}/pins/${messageId}`);
  }

  static unpinMessage(channelId: string, messageId: string) {
    return api.delete(`channels/${channelId}/pins/${messageId}`);
  }

  static createDmChannel(recipient: string) {
    return api.post(`users/@me/channels`, { recipient });
  }

  static deleteDmChannel(channelId: string) {
    return api.delete(`users/@me/channels/${channelId}`);
  }

  static updateChannel(channelId: string, data: any) {
    return api.patch(`channels/${channelId}`, data);
  }

  static deleteChannel(channelId: string) {
    return api.delete(`channels/${channelId}`);
  }

  static updateChannelPositions(serverId: string, data: any) {
    return api.patch(`/servers/${serverId}/channels`, data);
  }

  static createCategory(serverId: string, name: string) {
    return this.createChannel(serverId, {
      name,
      type: ChannelType.SERVER_CATEGORY,
    });
  }

  static getMessage(channelId: string, fetch?: { fetchType: string; messageId: string }) {
    let params: any = {
      limit: LIMIT_MESSAGES_PER_API_CALL,
    };

    if (fetch) {
      params[fetch.fetchType] = fetch.messageId;
    }

    return api.get(`/channels/${channelId}/messages`, {
      params,
    });
  }

  static getPinMessage(channelId: string) {
    return api.get<Message[]>(`/channels/${channelId}/pins`).then((data) => data.data);
  }

  static createMessage(
    channelId: string,
    data: any,
    onUploadProgress?: ((progressEvent: any) => void) | undefined
  ) {
    return api.post(`/channels/${channelId}/messages`, data, {
      onUploadProgress,
    });
  }

  static updateMessage(channelId: string, messageId: string, data: any) {
    return api.patch(`/channels/${channelId}/messages/${messageId}`, data);
  }

  static deleteMessage(channelId: string, messageId: string) {
    return api.delete(`/channels/${channelId}/messages/${messageId}`);
  }
}
