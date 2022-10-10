import { RelationshipType } from "types/user";
import api from "./api";

export class UserService {
  static async register(data: { email: string; username: string; password: string; dob: Date }) {
    return api.post("/auth/register", data);
  }

  static async update(data: any) {
    return api.patch("/users/@me", data);
  }

  static async updateSettings(data: any) {
    return api.patch("/users/@me/settings", data);
  }

  static async addFriend(username: string, discrimination: string) {
    return api.post("/users/@me/relationships", { username, discrimination });
  }

  static async updateRelationship(
    peerId: string,
    data?: { type?: RelationshipType; nickname?: string }
  ) {
    return api.put(`/users/@me/relationships/${peerId}`, data);
  }

  static async deleteRelationship(peerId: string) {
    return api.delete(`/users/@me/relationships/${peerId}`);
  }
}
