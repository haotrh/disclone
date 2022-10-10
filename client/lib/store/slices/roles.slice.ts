import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { Role, Server } from "types/server";
import { serversSlice } from "./servers.slice";
import { WritableDraft } from "immer/dist/internal";

type RoleSliceState = Record<string, Role>;

const initialState: RoleSliceState = {};

export const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    addRole: (state, { payload }: PayloadAction<Role>) => {
      state[payload.id] = payload;
    },
    addRoles: (state, { payload }: PayloadAction<Role[]>) => {
      payload.forEach((role) => {
        state[role.id] = role;
      });
    },
    deleteRole: (state, { payload }: PayloadAction<{ id: string }>) => {
      delete state[payload.id];
    },
    updateRole: (
      state,
      { payload }: PayloadAction<Partial<Role> & { id: string }>
    ) => {
      state[payload.id] = _.assign(state[payload.id], payload);
    },
  },
  extraReducers: {
    //@ts-expect-error
    [serversSlice.actions.addServer]: (
      state: WritableDraft<RoleSliceState>,
      { payload }: { payload: Server }
    ) => {
      if (payload.roles)
        payload.roles.forEach((role) => {
          state[role.id] = role;
        });
    },
    //@ts-expect-error
    [serversSlice.actions.addServers]: (
      state: WritableDraft<RoleSliceState>,
      { payload }: { payload: Server[] }
    ) => {
      payload.forEach((server) => {
        if (server.roles)
          server.roles.forEach((role) => {
            state[role.id] = role;
          });
      });
    },
  },
});

export const { addRole, addRoles, deleteRole, updateRole } = rolesSlice.actions;

export default rolesSlice.reducer;
