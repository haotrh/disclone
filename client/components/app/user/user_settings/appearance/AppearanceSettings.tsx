import ChatMessage from "@app/chat/content/ChatMessage";
import { Divider, Label, LayerModalContent, LayerModalHeader, RadioButton } from "@app/common";
import { useAppSelector } from "@hooks/redux";
import { UserService } from "@services/user.service";
import { userToMember } from "@utils/members";
import { useCallback } from "react";
import { MessageType } from "types/message";

const ApperanceSettings = () => {
  const user = useAppSelector((state) => state.me.user);
  const settings = useAppSelector((state) => state.me.settings);
  const messageCreate = useCallback(
    (content: string) => {
      return {
        channelId: "",
        id: content,
        content,
        author: "",
        createdAt: new Date(),
        type: MessageType.DEFAULT,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user]
  );

  if (!user) return null;

  const handleThemeChange = (theme: "dark" | "light") => {
    UserService.updateSettings({ theme });
  };

  return (
    <LayerModalContent>
      <LayerModalHeader>Apperance</LayerModalHeader>
      <div
        className="p-4 border relative border-background-tertiary flex flex-col justify-center
      bg-background-secondary rounded-md select-none h-[180px] overflow-hidden mb-8"
      >
        <ChatMessage
          readOnly
          groupStart
          author={userToMember(user)}
          message={messageCreate("Look at me I'm a beautiful butterfly")}
        />
        <ChatMessage readOnly message={messageCreate("Fluttering in the moonlight")} />
        <ChatMessage
          readOnly
          groupStart
          author={userToMember(user)}
          message={messageCreate("Waiting for the day when")}
        />
        <ChatMessage readOnly message={messageCreate("Compact mode would be turned on")} />
        <ChatMessage
          readOnly
          groupStart
          author={userToMember(user)}
          message={messageCreate("Oh here it is!")}
        />
      </div>
      <div>
        <Label>Theme</Label>
        <div className="space-y-2">
          <RadioButton
            onClick={() => handleThemeChange("dark")}
            selected={settings?.theme === "dark"}
            name="Dark"
          />
          <RadioButton
            onClick={() => handleThemeChange("light")}
            selected={settings?.theme === "light"}
            name="Light"
          />
        </div>
      </div>
      <Divider spacing="medium" />
      <div className="flex-center select-none">
        <img src="/images/settings-2.svg" alt="" />
      </div>
    </LayerModalContent>
  );
};

export default ApperanceSettings;
