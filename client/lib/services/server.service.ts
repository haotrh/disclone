import { CustomEmoji, Emoji, Invite, ServerEmoji } from "types/server";
import api from "./api";

export class ServerService {
  static createServer(name: string, icon: string | ArrayBuffer | null) {
    return api.post(`/servers`, {
      name,
      icon,
    });
  }

  static createInvite(serverId: string, maxAge: number, maxUses: number) {
    return api.post(`/servers/${serverId}/invites`, {
      maxAge,
      maxUses,
    });
  }

  static deleteInvite(inviteCode: string) {
    return api.delete(`/invites/${inviteCode}`);
  }

  static getInvites(serverId: string) {
    return api.get<Invite[]>(`/servers/${serverId}/invites`).then((data) => data.data);
  }

  static getServerMembers(serverId: string) {
    return api.get(`/servers/${serverId}/members`);
  }

  static updateServer(serverId: string, data: any) {
    return api.patch(`/servers/${serverId}`, data);
  }

  static deleteServer(serverId: string) {
    return api.delete(`/servers/${serverId}`);
  }

  static createRole(serverId: string) {
    return api.post(`/servers/${serverId}/roles`);
  }

  static updateRole(serverId: string, roleId: string, data: any) {
    return api.patch(`/servers/${serverId}/roles/${roleId}`, data);
  }

  static deleteRole(serverId: string, roleId: string) {
    return api.delete(`/servers/${serverId}/roles/${roleId}`);
  }

  static updateRolePositions(serverId: string, data: { id: string; position: number }[]) {
    return api.patch(`/servers/${serverId}/roles`, data);
  }

  static joinServer(serverId: string, inviteCode: string) {
    return api.put(`/servers/${serverId}/members/@me`, {
      inviteCode,
    });
  }

  static addRoleMembers(serverId: string, roleId: string, memberIds: string[]) {
    return api.patch(`/servers/${serverId}/roles/${roleId}/members`, {
      memberIds,
    });
  }

  static removeRoleMember(serverId: string, roleId: string, userId: string) {
    return api.delete(`/servers/${serverId}/members/${userId}/roles/${roleId}`);
  }

  static updateMember(serverId: string, userId: string, data: any) {
    return api.patch(`/servers/${serverId}/members/${userId}`, data);
  }

  static updateMeMember(serverId: string, data: any) {
    return api.patch(`/servers/${serverId}/members/@me`, data);
  }

  static leaveServer(serverId: string) {
    return api.patch(`/servers/${serverId}/members/@me`);
  }

  static getEmojis(serverId: string) {
    return api.get<ServerEmoji[]>(`/servers/${serverId}/emojis`).then((data) => data.data);
  }

  static uploadEmoji(serverId: string, data: any) {
    return api.post<CustomEmoji>(`/servers/${serverId}/emojis`, data).then((data) => data.data);
  }

  static updateEmoji(serverId: string, emojiId: string, data: any) {
    return api.patch(`/servers/${serverId}/emojis/${emojiId}`, data);
  }

  static deleteEmoji(serverId: string, emojiId: string) {
    return api.delete(`/servers/${serverId}/emojis/${emojiId}`);
  }
}
