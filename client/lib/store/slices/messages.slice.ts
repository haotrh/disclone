import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { Message } from "../../../types/message";
import { MessageState } from "../../../types/store.interfaces";

//key = channel_id
const initialState: Record<string, Record<string, MessageState>> = {};

export const convertMessageToMessageState: (message: Message) => MessageState = (message) => {
  return _.assign(message, {
    author: message?.author?.id,
    mentions: message?.mentions?.map((mention) => mention.id),
  });
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, { payload }: PayloadAction<Message>) => {
      const messageState = convertMessageToMessageState(payload);

      if (messageState.nonce) {
        delete state[messageState.channelId][messageState.nonce];
      }

      state[messageState.channelId][messageState.id] = messageState;
    },
    addMessages: (
      state,
      { payload }: PayloadAction<{ channelId: string; messages: Message[] }>
    ) => {
      const messagesState = payload.messages.map((message) =>
        convertMessageToMessageState(message)
      );

      state[payload.channelId] = _.assign(
        state[payload.channelId],
        _.keyBy(messagesState, (o) => o.id)
      );
    },
    addSendingMessage: {
      reducer: (state, { payload }: PayloadAction<MessageState>) => {
        state[payload.channelId][payload.id] = payload;
      },
      prepare: (message: MessageState) => {
        //@ts-expect-error
        message.createdAt = message.createdAt.toISOString();
        return { payload: message };
      },
    },
    updateMessage: (
      state,
      {
        payload,
      }: PayloadAction<
        Partial<MessageState> &
          Pick<MessageState, "id"> &
          Pick<MessageState, "channelId"> & { assign?: boolean }
      >
    ) => {
      if (state[payload.channelId]?.[payload.id]) {
        const { assign, ...data } = payload;

        state[payload.channelId][payload.id] = assign
          ? _.assign(state[payload.channelId][payload.id], data)
          : _.merge(state[payload.channelId][payload.id], data);
      }
    },
    deleteMessage: (state, { payload }: PayloadAction<{ id: string; channelId: string }>) => {
      delete state[payload.channelId][payload.id];
    },
  },
});

export const { addMessage, addMessages, addSendingMessage, updateMessage, deleteMessage } =
  messagesSlice.actions;

export default messagesSlice.reducer;
