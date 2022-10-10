import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { Server } from "../../../types/server";
import { ServerState } from "../../../types/store.interfaces";

type ServerSliceState = Record<string, ServerState>;

const initialState: ServerSliceState = {};

export const serversSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {
    addServer: (state, { payload }: PayloadAction<Server>) => {
      state[payload.id] = {
        ...payload,
        channels: payload.channels.map((channel) => channel.id),
        roles: payload.roles.map((role) => role.id).filter((id) => id !== payload.id),
        // emojis: payload.emojis.map((emoji) => emoji.id).filter((id) => id !== payload.id),
      };
    },
    addServers: (state, { payload }: PayloadAction<Server[]>) => {
      payload.forEach((server) => {
        state[server.id] = {
          ...server,
          channels: server.channels.map((channel) => channel.id),
          roles: server.roles.map((role) => role.id).filter((id) => id !== server.id),
          // emojis: server.emojis.map((emoji) => emoji.id).filter((id) => id !== server.id),
        };
      });
    },
    deleteServer: (state, { payload }: PayloadAction<{ id: string }>) => {
      delete state[payload.id];
    },
    addServerRole: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        roleId: string;
      }>
    ) => {
      state[payload.id].roles.push(payload.roleId);
    },
    removeServerRole: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        roleId: string;
      }>
    ) => {
      state[payload.id].roles = state[payload.id].roles.filter((role) => role !== payload.roleId);
    },
    addServerChannel: (
      state,
      {
        payload,
      }: PayloadAction<{
        id?: string;
        channelId: string;
      }>
    ) => {
      if (payload.id) state[payload.id].channels.push(payload.channelId);
    },
    removeServerChannel: (
      state,
      {
        payload,
      }: PayloadAction<{
        id: string;
        channelId: string;
      }>
    ) => {
      state[payload.id].channels = state[payload.id].channels.filter(
        (channel) => channel !== payload.channelId
      );
    },
    updateServer: (
      state,
      {
        payload,
      }: PayloadAction<
        (Partial<Server> | Partial<ServerState>) & {
          id: string;
        }
      >
    ) => {
      const { id, ...updateFields } = payload;

      if (state[id]) {
        state[id] = _.assign(state[id], updateFields);
      }
    },
  },
});

export const {
  addServer,
  addServers,
  updateServer,
  deleteServer,
  addServerChannel,
  addServerRole,
  removeServerChannel,
  removeServerRole,
} = serversSlice.actions;

export default serversSlice.reducer;
