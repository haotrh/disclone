import { UserStatus } from "../types/user";

const statusText: {
  [key in UserStatus]: string;
} = {
  dnd: "Do not disturb",
  idle: "Idle",
  offline: "Offline",
  online: "Online",
};

export function StatusParser(status: UserStatus) {
  return statusText[status];
}

// export function getStatus({ member, user }: MemberOrUser) {
//   if (member) {
//     return member.user.status;
//   } else {
//     user.status;
//   }
// }
