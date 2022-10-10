import { Avatar, Divider, Label, MarkdownRender, NameWithNumber } from "@app/common";
import { imageKitLoader } from "@utils/image";
import { usernameWithDiscrimination } from "@utils/members";
import _ from "lodash";
import Image from "next/image";
import React from "react";
import { Member } from "types/server";
import { User } from "types/user";

interface ProfileInfoProps {
  member?: Member;
  user?: User;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ member, user = member?.user }) => {
  if (!member && !user) {
    return null;
  }

  return (
    <div className="w-[300px] bg-background-floating rounded-lg">
      <div className="min-h-[60px] bg-[#2c60a8] relative rounded-t-lg">
        {(member?.banner || user?.banner) && (
          <div className="relative h-[120px] min-w-[300px] rounded-t-lg overflow-hidden">
            <Image
              loader={imageKitLoader}
              src={member?.banner ?? user?.banner ?? ""}
              layout="fill"
              alt=""
            />
          </div>
        )}
        <div className="absolute left-4 top-full -translate-y-1/2 rounded-full bg-background-floating border-[6px] border-transparent">
          <Avatar noStatus user={member ?? user} size={80} />
        </div>
      </div>
      <div className="mt-10 p-4">
        <div className="font-semibold text-xl text-header-primary">
          {user &&
            (!_.isEmpty(member?.nick) ? member?.nick : user && <NameWithNumber user={user} />)}
        </div>
        {user && member?.nick && (
          <div className="text-header-secondary text-sm">{usernameWithDiscrimination(user)}</div>
        )}
        {member?.bio && (
          <div className="mt-3 text-sm break-words">
            <MarkdownRender
              id={`ProfileInfoBio${member.user.id}`}
              omitTypes={["blockquote", "codeBlock"]}
              text={member?.bio}
            />
          </div>
        )}
        {user?.bio && (
          <div>
            <Divider />
            <div className="break-words font-normal">
              <Label>About me</Label>
              <MarkdownRender
                id={`ProfileInfoAboutMe${user.id}`}
                omitTypes={["blockquote", "codeBlock", "mention"]}
                text={user.bio}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfo;
