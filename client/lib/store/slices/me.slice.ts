import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { Relationship, User, UserSettings } from "../../../types/user";

interface MeState {
  user?: User;
  settings?: UserSettings;
  relationships: Relationship[];
}

const initialState: MeState = {
  relationships: [],
};

export const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {
    updateSettings: (state, { payload }: PayloadAction<Partial<UserSettings>>) => {
      state.settings = _.merge(state.settings, payload);
    },
    addInfo: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
    },
    updateInfo: (state, { payload }: PayloadAction<Partial<User>>) => {
      state.user = _.merge(state.user, payload);
    },
    addRelationship: (state, { payload }: PayloadAction<Relationship>) => {
      const relationshipIndex = state.relationships.findIndex(
        (relationship) => relationship.id === payload.id
      );
      if (relationshipIndex === -1) {
        state.relationships.push(payload);
      } else {
        state.relationships[relationshipIndex] = payload;
      }
    },
    removeRelationship: (state, { payload }: PayloadAction<Partial<User>>) => {
      state.relationships = state.relationships.filter(
        (relationship) => relationship.id !== payload.id
      );
    },
  },
});

export const { addInfo, updateInfo, updateSettings, addRelationship, removeRelationship } =
  meSlice.actions;

export default meSlice.reducer;
