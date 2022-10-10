export type UserStatus = "online" | "offline" | "idle" | "dnd";

export interface User {
  id: string;
  email?: string;
  username: string;
  discrimination: string;
  avatar?: string;
  banner?: string;
  verified?: boolean;
  bio?: string;
  status: UserStatus;
}

type Theme = "dark" | "light";

export interface UserSettings {
  theme: Theme;
  serversPositions: string[];
  status: UserStatus;
}

export enum RelationshipType {
  FRIEND = 1,
  BLOCK = 2,
  INCOMING = 3,
  OUTGOING = 4,
}

export interface Relationship {
  id: string;
  type: RelationshipType;
  nickname: string | null;
  user: User;
}
