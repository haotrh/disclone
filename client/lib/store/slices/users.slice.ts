import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import _ from "lodash";
import { Channel } from "types/channel";
import { Member } from "../../../types/server";
import { Relationship, User } from "../../../types/user";
import { channelsSlice } from "./channels.slice";
import { meSlice } from "./me.slice";
import { membersSlice } from "./members.slice";

//key = userId
const initialState: Record<string, User> = {};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, { payload }: PayloadAction<User>) => {
      state[payload.id] = payload;
    },
    addUsers: (state, { payload }: PayloadAction<User[]>) => {
      payload.forEach((user) => {
        state[user.id] = user;
      });
    },
    updateUser: (state, { payload }: PayloadAction<Partial<User> & { id: string }>) => {
      if (state[payload.id]) {
        state[payload.id] = _.assign(state[payload.id], payload);
      }
    },
    deleteUser: (state, { payload }: PayloadAction<{ id: string }>) => {
      delete state[payload.id];
    },
  },
  extraReducers: {
    //@ts-expect-error
    [membersSlice.actions.addMember]: (state, { payload }) => {
      if (payload.user?.id) state[payload.user.id] = payload.user;
    },
    //@ts-expect-error
    [membersSlice.actions.addMembers]: (state, { payload }) => {
      payload.members.forEach((member: Member) => {
        if (member.user?.id) state[member.user.id] = member.user;
      });
    },
    //@ts-expect-error
    [meSlice.actions.addRelationship]: (
      state: WritableDraft<Record<string, User>>,
      { payload }: { payload: Relationship }
    ) => {
      state[payload.user.id] = _.assign(state[payload.user.id], payload.user);
    },
    //@ts-expect-error
    [channelsSlice.actions.addChannel]: (
      state: WritableDraft<Record<string, User>>,
      { payload }: { payload: Channel }
    ) => {
      payload.recipients?.forEach((user) => (state[user.id] = _.assign(state[user.id], user)));
    },
    //@ts-expect-error
    [channelsSlice.actions.addChannels]: (
      state: WritableDraft<Record<string, User>>,
      { payload }: { payload: Channel[] }
    ) => {
      payload.forEach((channel) =>
        channel.recipients?.forEach((user) => (state[user.id] = _.assign(state[user.id], user)))
      );
    },
  },
});

export const { addUser, addUsers, updateUser } = usersSlice.actions;

export default usersSlice.reducer;
