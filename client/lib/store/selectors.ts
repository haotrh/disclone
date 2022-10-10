import { createSelector } from "@reduxjs/toolkit";
import { CUSTOM_EMOJI_REGEX, SHORTCODE_EMOJI_REGEX, UNICODE_EMOJI_REGEX } from "@utils/regex";
import _ from "lodash";
import { CustomEmoji, Emoji, Member, Role, StandardEmoji } from "types/server";
import { RelationshipType } from "types/user";
import { ChannelType } from "../../types/channel";
import { ChannelState } from "../../types/store.interfaces";
import { RootState } from "./store";

const selectServerChannels = createSelector(
  (state: RootState) => state.servers,
  (state: RootState) => state.channels,
  (state: RootState, serverId: string) => serverId,
  (servers, channels, serverId) => _.values(_.pick(channels, servers[serverId]?.channels))
);

const selectEveryoneRole = createSelector(
  (state: RootState) => state.roles,
  (state: RootState, serverId: string) => serverId,
  (roles, serverId) => roles[serverId]
);

const selectRole = createSelector(
  (state: RootState) => state.roles,
  (state: RootState, roleId: string) => roleId,
  (roles, roleId) => roles[roleId]
);

const selectServerRoles = createSelector(
  (state: RootState) => state.servers,
  (state: RootState) => state.roles,
  (state: RootState, serverId: string) => serverId,
  (servers, roles, serverId) =>
    _.orderBy(_.values(_.pick(roles, servers[serverId].roles)), "position")
);

const selectUncategorizedChannel = createSelector(
  (state: RootState, serverId: string) => selectServerChannels(state, serverId),
  (channels) =>
    channels.filter((channel) => channel.type !== ChannelType.SERVER_CATEGORY && !channel.parentId)
);

const selectTextChannels = createSelector(
  (state: RootState, serverId: string) => selectServerChannels(state, serverId),
  (channels) => channels.filter((channel) => channel.type === ChannelType.SERVER_TEXT)
);

const selectServerCategories = createSelector(
  (state: RootState, serverId: string) => selectServerChannels(state, serverId),
  (channels) =>
    _.orderBy(
      channels.filter((channel) => channel.type === ChannelType.SERVER_CATEGORY),
      ["position", "createdAt"]
    )
);

// const selectServerCategoryChannels = createSelector(
//   (state: RootState) => state.channels,
//   (state: RootState, categoryId: string) => categoryId,
//   (channels, categoryId) => {
//     return _.orderBy(
//       _.flatten(_.values(channels).map((channel) => _.values(channel))).filter(
//         (channel) => channel.parentId === categoryId
//       ),
//       ["type", "position", "createdAt"]
//     );
//   }
// );

const selectServerOrderChannels = createSelector(
  (state: RootState, serverId: string) => selectServerChannels(state, serverId),
  (channels) => {
    const group = _.groupBy(channels, "parentId");

    const noParentChannels = _.orderBy(_.concat(group["null"] ?? [], group["undefined"] ?? []), [
      "type",
      "position",
    ]);

    const orderChannels =
      noParentChannels?.reduce((prev, curr) => {
        return curr.type === ChannelType.SERVER_CATEGORY
          ? [...prev, curr, ..._.orderBy(group[curr.id] ?? [], ["type", "position"])]
          : [...prev, curr];
      }, [] as ChannelState[]) ?? [];

    return orderChannels;
  }
);

const selectChannelMesasges = createSelector(
  (state: RootState) => state.messages,
  (state: RootState, channel: string) => channel,
  (messages, channel) => _.values(messages[channel])
);

const selectMember = createSelector(
  (state: RootState) => state.members,
  (state: RootState) => state.users,
  (state: RootState, info: { id: string; server: string }) => info,
  (members, users, info) =>
    (members[info.server]?.[info.id] || users[info.id]) &&
    _.assign({}, members[info.server]?.[info.id], { user: users[info.id] })
);

const selectMembers = createSelector(
  (state: RootState) => state.members,
  (state: RootState) => state.users,
  (state: RootState, server: string) => server,
  (members, users, server) =>
    members[server]
      ? _.values(members[server]).map((member) => ({
          ...member,
          user: users[member.user],
        }))
      : []
);

const selectMeMember = createSelector(
  (state: RootState) => state.me.user,
  (state: RootState) => state.members,
  (state: RootState, server: string) => server,
  (user, members, server): Member | null => {
    return members?.[server]?.[user?.id ?? ""] && user
      ? { ...members[server][user?.id ?? ""], user }
      : null;
  }
);

const selectMembersWithoutRole = createSelector(
  (state: RootState, { serverId, roleId }: { serverId: string; roleId: string }) =>
    selectMembers(state, serverId),
  (state: RootState, { serverId, roleId }: { serverId: string; roleId: string }) => roleId,
  (members, roleId) => members.filter((member) => !member.roles.includes(roleId))
);

const selectMembersWithRole = createSelector(
  (state: RootState, { serverId, roleId }: { serverId: string; roleId: string }) =>
    selectMembers(state, serverId),
  (state: RootState, { serverId, roleId }: { serverId: string; roleId: string }) => roleId,
  (members, roleId) => members.filter((member) => member.roles.includes(roleId))
);

const selectMemberVisualRole = createSelector(
  (state: RootState) => state.roles,
  (state: RootState, { serverId, userId }: { serverId: string; userId: string }) =>
    selectMember(state, { id: userId, server: serverId }),
  (state: RootState, { serverId }: { serverId: string; userId: string }) => serverId,
  (roles, member, serverId): Role | null =>
    _.orderBy(
      _.values(_.pick(roles, member?.roles ?? [])).filter((role) => role.hoist),
      ["position", "asc"]
    )?.[0] ?? null
);

const selectMemberRoles = createSelector(
  (state: RootState) => state.roles,
  (state: RootState, { serverId, userId }: { serverId: string; userId: string }) =>
    selectMember(state, { id: userId, server: serverId }),
  (state: RootState, { serverId }: { serverId: string; userId: string }) => serverId,
  (roles, member): Role[] =>
    _.orderBy(_.values(_.pick(roles, member?.roles ?? [])), "position", "asc")
);

const selectMembersWithVisualRole = createSelector(
  (state: RootState) => state.roles,
  (state: RootState) => state.members,
  (state: RootState) => state.users,
  (state: RootState, server: string) => server,
  (roles, members, users, server) =>
    members[server]
      ? _.values(members[server]).map((member) => ({
          ...member,
          user: users[member.user],
          visualRole: _.orderBy(
            _.values(_.pick(roles, member?.roles ?? [])).filter((role) => role.hoist),
            ["position", "asc"]
          )?.[0],
        }))
      : []
);

const selectEmojiCategories = createSelector(
  (state: RootState) => state.emoji.categories,
  (categories) => {
    return _.sortBy(categories, "server", "desc");
  }
);

const selectFriends = createSelector(
  (state: RootState) => state.me.relationships,
  (state: RootState) => state.users,
  (relationships, users) => {
    return _.values(
      _.pick(
        users,
        relationships
          .filter((relationship) => relationship.type === RelationshipType.FRIEND)
          .map((relationship) => relationship.id)
      )
    );
  }
);

const selectRelationships = createSelector(
  (state: RootState) => state.me.relationships,
  (state: RootState) => state.users,
  (state: RootState, type: RelationshipType[] | RelationshipType) => type,
  (relationships, users, type) => {
    return relationships
      .filter((relationship) =>
        _.isArray(type) ? type.includes(relationship.type) : relationship.type === type
      )
      .map((relationship) =>
        _.assign({}, relationship, { user: users[relationship.id] ?? relationship.user })
      );
  }
);

const selectDmChannels = createSelector(
  (state: RootState) => state.channels,
  (channels) => {
    return _.values(channels).filter((channel) => channel.type === ChannelType.DM);
  }
);

const selectAllEmojiData = createSelector(
  (state: RootState) => state.emoji.emojis,
  (emojis) => {
    const nativeMapping: {
      [unicode: string]: Emoji;
    } = {};
    const emojiNameMapping: {
      [name: string]: Emoji;
    } = {};
    const customEmojiIdMapping: {
      [id: string]: Emoji;
    } = {};

    const duplicateNames: { [key: string]: number } = {};
    const emojiList = emojis.map((emoji) => {
      const tmpEmoji = _.cloneDeep(emoji);
      "native" in tmpEmoji && (nativeMapping[tmpEmoji.native] = tmpEmoji);
      if (tmpEmoji.hasOwnProperty("id")) {
        customEmojiIdMapping[(tmpEmoji as CustomEmoji).id] = tmpEmoji;
      }
      if ("skins" in tmpEmoji) {
        tmpEmoji.skins?.forEach((skin, i) => {
          const name = tmpEmoji.name + "::skin-tone-" + i;
          emojiNameMapping[name] = skin;
          emojiNameMapping[skin.name] = skin;
          nativeMapping[skin.native] = skin;
        });
      }
      if ("native" in tmpEmoji) {
        emojiNameMapping[tmpEmoji.name] = tmpEmoji;
      } else {
        const normalizeName = tmpEmoji.name.replace(/\W/g, "");
        if (emojiNameMapping.hasOwnProperty(normalizeName)) {
          const number = (duplicateNames[tmpEmoji.name] ?? 0) + 1;
          const altName = tmpEmoji.name.replace(/\W/g, "") + "~" + number;
          tmpEmoji.altName = altName;
          duplicateNames[tmpEmoji.name] = number;
        } else {
          tmpEmoji.altName = normalizeName;
          emojiNameMapping[normalizeName] = tmpEmoji;
        }
      }
      tmpEmoji.fullName = ":" + (tmpEmoji.altName ?? tmpEmoji.name) + ":";
      return tmpEmoji;
    });
    return { nativeMapping, emojiNameMapping, customEmojiIdMapping, emojiList };
  }
);

const selectEmojiCategoriesWithData = createSelector(
  (state: RootState) => state.emoji.categories,
  selectAllEmojiData,
  (categories, { customEmojiIdMapping, emojiNameMapping }) => {
    return _.sortBy(
      _.values(categories).map((category) => ({
        ...category,
        emojis: category.emojis.map((emoji) =>
          category.server ? customEmojiIdMapping[emoji] : emojiNameMapping[emoji]
        ),
      })),
      "server",
      "desc"
    );
  }
);

const selectEmojiByText = createSelector(
  selectAllEmojiData,
  (state: RootState, text: string) => text,
  ({ customEmojiIdMapping, emojiNameMapping, nativeMapping }, text): Emoji | null => {
    let match = text.match(CUSTOM_EMOJI_REGEX);
    if (match) {
      const id = match[2];
      if (customEmojiIdMapping[id]) return customEmojiIdMapping[id];
      const emoji: CustomEmoji = { id: match[2], name: match[1] };
      return emoji;
    }
    match = text.match(UNICODE_EMOJI_REGEX);
    if (match) {
      return nativeMapping[match[0]];
    }
    match = text.match(SHORTCODE_EMOJI_REGEX);
    if (match) {
      const name = match[1];
      const skin = match[2];
      const emoji = emojiNameMapping[name];
      if (!emoji) {
        return null;
      }
      return "skins" in emoji && emoji?.skins?.[skin] ? emoji.skins[skin] : emoji;
    }
    return null;
  }
);

const selectEmojiRegexByShortcode = createSelector(
  [selectAllEmojiData],
  ({ emojiNameMapping }) =>
    new RegExp(
      [
        UNICODE_EMOJI_REGEX.source,
        _.keys(emojiNameMapping)
          .map((key) => "(?<!<):" + key + ":")
          .join("|"),
        CUSTOM_EMOJI_REGEX.source,
      ].join("|"),
      "g"
    )
);

const selectChannel = createSelector(
  (state: RootState) => state.channels,
  (state: RootState) => state.me,
  (state: RootState) => state.users,
  (state: RootState, channelId: string) => channelId,
  (channels, me, users, channelId) =>
    channels[channelId]
      ? _.assign({}, channels[channelId], {
          recipients: _.values(
            _.pick(
              users,
              channels[channelId].recipients?.filter((recipient) => recipient !== me.user?.id) ?? []
            )
          ),
        })
      : null
);

const selectServerPermissions = createSelector(
  (state: RootState) => state.roles,
  (state: RootState) => state.me.user,
  (state: RootState) => state.members,
  (state: RootState) => state.servers,
  (state: RootState, serverId?: string) => serverId,
  (roles, me, members, servers, serverId) => {
    if (!serverId) {
      return 0;
    }
    const server = servers[serverId];
    if (server.ownerId === me?.id) {
      return 0;
    }
    //everyone permissions
    let permissions = parseInt(roles[server.id].permissions);
    const meMember = members[serverId]?.[me?.id ?? ""];
    meMember?.roles?.forEach((memberRole) => {
      const role = roles[memberRole];
      permissions = permissions | parseInt(role.permissions);
    });
    return permissions;
  }
);

export {
  selectEmojiCategoriesWithData,
  selectEmojiCategories,
  selectServerChannels,
  selectRelationships,
  selectEmojiByText,
  selectAllEmojiData,
  selectServerPermissions,
  selectChannelMesasges,
  selectChannel,
  selectDmChannels,
  selectEmojiRegexByShortcode,
  selectMember,
  selectMembers,
  selectMemberRoles,
  selectServerRoles,
  selectEveryoneRole,
  selectServerCategories,
  selectUncategorizedChannel,
  selectFriends,
  selectServerOrderChannels,
  selectTextChannels,
  selectRole,
  selectMembersWithoutRole,
  selectMembersWithRole,
  selectMemberVisualRole,
  selectMembersWithVisualRole,
  selectMeMember,
};
