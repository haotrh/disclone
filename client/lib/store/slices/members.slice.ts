import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { Member } from "../../../types/server";
import { MemberState } from "../../../types/store.interfaces";

//key = server_id, key_2 = user_id
const initialState: Record<string, Record<string, MemberState>> = {};

const convertMemberToMemberState: (member: Member) => MemberState = (member) => {
  return { ...member, user: member.user?.id };
};

export const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    addMember: (state, { payload }: PayloadAction<{ serverId: string; member: Member }>) => {
      const memberState = convertMemberToMemberState(payload.member);
      memberState.serverId = payload.serverId;

      state[payload.serverId][memberState.user] = memberState;
    },
    addMembers: (state, { payload }: PayloadAction<{ serverId: string; members: Member[] }>) => {
      const memberStates = payload.members.map((member) => ({
        ...convertMemberToMemberState(member),
        serverId: payload.serverId,
      }));

      state[payload.serverId] = _.assign(
        state[payload.serverId],
        _.keyBy(memberStates, (o) => o.user)
      );
    },
    updateMember: (
      state,
      {
        payload,
      }: PayloadAction<{
        serverId: string;
        userId: string;
        member: Partial<Member>;
      }>
    ) => {
      const { serverId, userId, member } = payload;

      state[serverId][userId] = _.assign(
        state[serverId][userId],
        _.assign(member, { user: userId })
      );
    },
    deleteMember: (state, { payload }: PayloadAction<{ serverId: string; id: string }>) => {
      delete state[payload.serverId][payload.id];
    },
    addMemberRole: (
      state,
      { payload }: PayloadAction<{ serverId: string; userId: string; roleId: string }>
    ) => {
      state?.[payload.serverId]?.[payload.userId]?.roles?.push(payload.roleId);
    },
    removeMemberRole: (
      state,
      { payload }: PayloadAction<{ serverId: string; userId: string; roleId: string }>
    ) => {
      if (state?.[payload.serverId]?.[payload.userId]?.roles) {
        state[payload.serverId][payload.userId].roles = state[payload.serverId][
          payload.userId
        ].roles.filter((role) => role !== payload.roleId);
      }
    },
  },
});

export const {
  addMember,
  addMembers,
  deleteMember,
  updateMember,
  addMemberRole,
  removeMemberRole,
} = membersSlice.actions;

export default membersSlice.reducer;
