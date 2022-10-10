import { configureStore } from "@reduxjs/toolkit";
import channelsSlice from "./slices/channels.slice";
import meSlice from "./slices/me.slice";
import membersSlice from "./slices/members.slice";
import messagesSlice from "./slices/messages.slice";
import serversSlice from "./slices/servers.slice";
import rolesSlice from "./slices/roles.slice";
import usersSlice from "./slices/users.slice";
import emojiSlice from "./slices/emoji.slice";

export const store = configureStore({
  reducer: {
    users: usersSlice,
    servers: serversSlice,
    me: meSlice,
    channels: channelsSlice,
    messages: messagesSlice,
    members: membersSlice,
    roles: rolesSlice,
    emoji: emojiSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
