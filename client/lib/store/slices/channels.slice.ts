import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import _ from "lodash";
import { Channel } from "types/channel";
import { Server } from "types/server";
import { ChannelState } from "types/store.interfaces";
import { serversSlice } from "./servers.slice";

//key = channel_id
type ChannelSliceState = Record<string, ChannelState>;

const initialState: ChannelSliceState = {};

export const toChannelState: (channel: Channel) => ChannelState = (channel) => {
  return _.assign({}, channel, {
    firstLoadMessages: false,
    seeFirstMessages: false,
    seeLastMessages: false,
    showMember: true,
    collapsed: false,
    recipients: (channel.recipients ?? []).map((recipient) => recipient.id),
  });
};

export const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addChannel: (state, { payload: channel }: PayloadAction<Channel>) => {
      const channelState = toChannelState(channel);
      state[channel.id] = channelState;
    },
    addChannels: (state, { payload: channels }: PayloadAction<Channel[]>) => {
      channels.forEach((channel) => {
        const channelState = toChannelState(channel);
        state[channel.id] = channelState;
      });
    },
    updateChannel: (
      state,
      { payload }: PayloadAction<Partial<ChannelState> | Partial<Channel>>
    ) => {
      const { id } = payload;

      if (id && state[id]) {
        state[id] = _.assign(state[id], payload);
      }
    },
    deleteChannel: (state, { payload: { id } }: PayloadAction<{ id: string }>) => {
      delete state[id];
    },
  },
  extraReducers: {
    //@ts-expect-error
    [serversSlice.actions.addServer]: (
      state: WritableDraft<ChannelSliceState>,
      { payload }: { payload: Server }
    ) => {
      payload.channels.forEach((channel) => {
        const channelState = toChannelState(channel);
        state[channel.id] = channelState;
      });
    },
    //@ts-expect-error
    [serversSlice.actions.addServers]: (
      state: WritableDraft<ChannelSliceState>,
      { payload }: { payload: Server[] }
    ) => {
      payload.forEach((server) => {
        if (server.channels)
          server.channels.forEach((channel) => {
            const channelState = toChannelState(channel);
            state[channel.id] = channelState;
          });
      });
    },
  },
});

export const { addChannel, addChannels, updateChannel, deleteChannel } = channelsSlice.actions;

export default channelsSlice.reducer;
