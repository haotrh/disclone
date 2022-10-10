import { Member } from "types/server";
import { User } from "types/user";

export const getMemberName = (member: Member) => {
  return member?.nick ?? member?.user?.username;
};

export const usernameWithDiscrimination = (user: User) => {
  return user.username + "#" + user.discrimination;
};

export const userToMember = (user: User) => {
  const member: Member = {
    user,
    bio: "",
    deaf: false,
    joinedAt: new Date(),
    mute: false,
    roles: [],
  };
  return member;
};
