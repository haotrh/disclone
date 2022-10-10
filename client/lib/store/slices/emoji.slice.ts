import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import emojiDatas from "@utils/emoji-data-twitter.json";
import { WritableDraft } from "immer/dist/internal";
import _ from "lodash";
import { CustomEmoji, Emoji, Server } from "types/server";
import { serversSlice } from "./servers.slice";

export type EmojiCategory = {
  id: string;
  emojis: string[];
  server?: boolean;
};

type EmojiSliceState = {
  categories: Record<string, EmojiCategory>;
  emojis: Emoji[];
  keywords: {
    [id: string]: string[];
  };
  sheet: {
    cols: number;
    rows: number;
  };
};

const { categories, emojis, keywords, sheet } = emojiDatas;

const initialState: EmojiSliceState = {
  categories: _.keyBy(categories, "id"),
  emojis,
  keywords,
  sheet,
};

const addEmojiToState = (
  state: WritableDraft<EmojiSliceState>,
  emoji: CustomEmoji,
  serverId: string
) => {
  state.emojis.push(_.defaults(emoji, { serverId }));
  if (state.categories.hasOwnProperty(serverId)) {
    state.categories[serverId].emojis.push(emoji.id);
  } else {
    state.categories[serverId] = {
      id: serverId,
      emojis: ["id" in emoji ? emoji.id : emoji.name],
      server: true,
    };
  }
};

export const emojiSlice = createSlice({
  name: "emojis",
  initialState,
  reducers: {
    addEmoji: (state, { payload }: PayloadAction<{ serverId: string; emoji: CustomEmoji }>) => {
      const { serverId, emoji } = payload;
      addEmojiToState(state, emoji, serverId);
      // state.emojis.push(_.defaults(emoji, { serverId }));
    },
    deleteEmoji: (state, { payload }: PayloadAction<{ serverId: string; emojiId: string }>) => {
      const index = _.findIndex(state.emojis, { id: payload.emojiId });
      state.emojis.splice(index, 1);
      if (state.categories[payload.serverId]) {
        state.categories[payload.serverId].emojis = state.categories[
          payload.serverId
        ].emojis.filter((emoji) => emoji !== payload.emojiId);
      }
    },
    updateEmoji: (state, { payload }: PayloadAction<Partial<Emoji> & { id: string }>) => {
      const index = _.findIndex(state.emojis, { id: payload.id });
      state.emojis.splice(index, 1, { ...state.emojis[index], ...payload });
    },
  },
  extraReducers: {
    //@ts-expect-error
    [serversSlice.actions.addServer]: (
      state: WritableDraft<EmojiSliceState>,
      { payload }: { payload: Server }
    ) => {
      if (payload.emojis)
        payload.emojis.forEach((emoji) => {
          addEmojiToState(state, emoji, payload.id);
        });
    },
    //@ts-expect-error
    [serversSlice.actions.addServers]: (
      state: WritableDraft<EmojiSliceState>,
      { payload }: { payload: Server[] }
    ) => {
      payload.forEach((server) => {
        if (server.emojis)
          server.emojis.forEach((emoji) => {
            addEmojiToState(state, emoji, server.id);
          });
      });
    },
  },
});

export const { addEmoji, deleteEmoji, updateEmoji } = emojiSlice.actions;

export default emojiSlice.reducer;
