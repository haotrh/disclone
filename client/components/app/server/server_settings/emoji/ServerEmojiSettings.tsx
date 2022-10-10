import {
  Avatar,
  Button,
  Divider,
  ImageFileInput,
  Input,
  Label,
  LayerModalContent,
  LayerModalDescription,
  LayerModalHeader,
  Table,
} from "@app/common";
import { RoundLoading } from "@components/common";
import { useChannel } from "@contexts/ChannelContext";
import { ServerService } from "@services/server.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCustomEmojiSrc } from "@utils/emoji.util";
import _ from "lodash";

interface UploadEmojiData {
  name: string;
  image: string;
}

const MAX_EMOJI_SLOT = 50;

const ServerEmojiSettings = () => {
  const { server } = useChannel();
  const { data, refetch, isLoading } = useQuery(
    ["emoji", server?.id],
    () => ServerService.getEmojis(server?.id ?? ""),
    {
      refetchInterval: Infinity,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: Infinity,
      retryDelay: 2000,
    }
  );
  const uploadEmojiMutation = useMutation(
    (file: UploadEmojiData) => ServerService.uploadEmoji(server?.id ?? "", file),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );
  const updateEmojiMutation = useMutation(
    ({ emojiId, name }: { emojiId: string; name: string }) =>
      ServerService.updateEmoji(server?.id ?? "", emojiId, { name }),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  return (
    <LayerModalContent>
      <LayerModalHeader>Emoji</LayerModalHeader>
      <LayerModalDescription>
        Add up to {MAX_EMOJI_SLOT} custom emoji that anyone can use in this server. Animated GIF
        emoji is allowed.
      </LayerModalDescription>
      <LayerModalDescription>
        <Label>UPLOAD REQUIREMENTS</Label>
        <ul className="list-disc pl-5">
          <li>File type: JPEG, PNG, GIF</li>
          <li>Recommended file size: 256 KB (We&apos;ll compress it for you)</li>
          <li>Recommended dimensions: 108x108</li>
          <li>
            Naming: Emoji names must be at least 2 characters long and can only contain alphanumeric
            characters and underscores
          </li>
        </ul>
      </LayerModalDescription>
      <div>
        <Button className="relative" size="medium" grow>
          Upload Emoji
          <ImageFileInput
            uploadingModal={uploadEmojiMutation.isLoading}
            onChange={(base64, file) => {
              if (base64) {
                uploadEmojiMutation.mutate({
                  image: base64,
                  name: file.name.replace(/[^0-9a-zA-Z]+/, "").replace(/\.[^/.]+$/, ""),
                });
              }
            }}
          />
        </Button>
      </div>
      <Divider spacing="small" />
      {isLoading && (
        <div className="flex-center p-10">
          <RoundLoading />
        </div>
      )}
      {!isLoading && _.isEmpty(data) && (
        <div className="flex-center flex-col gap-2 text-text-muted select-none">
          <img className="select-none" src="/images/emoji.svg" alt="" />
          <div className="text-[17px] font-semibold mt-6">NO EMOJI</div>
          <div className="max-w-[440px] text-center">
            Get the party started by uploading an emoji
          </div>
        </div>
      )}
      {data && !_.isEmpty(data) && (
        <>
          <div className="text-header-primary font-semibold">
            Emoji — {MAX_EMOJI_SLOT - data.length} slots available
          </div>
          <Table
            data={data}
            handleDeleteRow={(emoji) =>
              ServerService.deleteEmoji(server?.id ?? "", emoji.id).then(() => refetch())
            }
            columns={[
              {
                title: "Image",
                field: "id",
                flexStyle: "0 0 60px",
                render: ({ id }) => (
                  <div
                    className="w-8 h-8"
                    style={{ backgroundImage: `url(${getCustomEmojiSrc(id)})` }}
                  />
                ),
              },
              {
                title: "Name",
                field: "name",
                flexStyle: "0 0 50%",
                render: ({ name, id }) => (
                  <div className="w-[200px] flex relative overflow-hidden items-center gap-0.5 text-[15px] leading-7">
                    <Input
                      onBlur={(e) => {
                        const trimValue = e.target.value.trim();
                        if (!_.isEmpty(trimValue) && trimValue !== name)
                          updateEmojiMutation.mutate({
                            emojiId: id,
                            name: trimValue,
                          });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.target.blur();
                        }
                      }}
                      className="opacity-0 !rounded group-hover:opacity-100 w-full
                    absolute focus-within:opacity-100 z-50"
                      inputClassName="!p-1"
                      defaultValue={name}
                    />
                    <div
                      className="min-w-0 overflow-hidden p-1 overflow-ellipsis
                  text-header-primary whitespace-nowrap relative"
                    >
                      <div className="font-medium text-text-muted absolute left-0">:</div>
                      <div className="font-medium text-text-muted absolute right-0">:</div>
                      {name}
                    </div>
                  </div>
                ),
              },
              {
                title: "Uploaded by",
                field: "user",
                flexStyle: "0 0 50%",
                render: ({ user }) => (
                  <div className="flex items-center gap-2">
                    <Avatar size={24} noStatus user={user} />
                    <div>{user?.username}</div>
                  </div>
                ),
              },
            ]}
            rowKey={"id"}
          />
        </>
      )}
    </LayerModalContent>
  );
};

export default ServerEmojiSettings;
