import { useAppSelector } from "@hooks/redux";
import { selectAllEmojiData } from "@store/selectors";
import classNames from "classnames";
import _ from "lodash";
import React, { ReactNode, useMemo, useState } from "react";
import { StandardEmoji } from "types/server";
import { Button } from "../button";
import { ButtonProps } from "../button/Button";
import EmojiFromSprite from "./emoji/EmojiFromSprite";
import { ExpressionTab } from "./ExpressionPicker";
import { useExpressionPicker } from "./ExpressionPickerContext";

interface ExpressButtonProps extends ButtonProps {
  targetTab: ExpressionTab;
  children?: ReactNode;
}

const ExpressionButton: React.FC<ExpressButtonProps> = ({
  targetTab,
  children,
  className,
  ...props
}) => {
  const { setTab, tab } = useExpressionPicker();

  return (
    <Button
      onClick={() => (tab === targetTab ? setTab(null) : setTab(targetTab))}
      theme="blank"
      className={classNames(className, "h-10 flex-center sticky top-0 p-1 mx-1", {
        "text-interactive-hover": tab === targetTab,
      })}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ExpressionButton;

export const ExpressionEmojiButton = () => {
  const emojiList = useMemo(
    () => [
      "grinning",
      "smiley",
      "smile",
      "grin",
      "laughing",
      "sweat_smile",
      "rolling_on_the_floor_laughing",
      "joy",
      "slightly_smiling_face",
      "upside_down_face",
      "melting_face",
      "wink",
      "blush",
      "innocent",
      "smiling_face_with_3_hearts",
      "heart_eyes",
      "star-struck",
      "kissing_heart",
      "kissing",
      "relaxed",
      "kissing_closed_eyes",
      "kissing_smiling_eyes",
      "smiling_face_with_tear",
      "yum",
      "stuck_out_tongue",
      "stuck_out_tongue_winking_eye",
      "zany_face",
      "stuck_out_tongue_closed_eyes",
      "money_mouth_face",
      "hugging_face",
      "face_with_hand_over_mouth",
      "face_with_open_eyes_and_hand_over_mouth",
      "face_with_peeking_eye",
      "shushing_face",
      "thinking_face",
      "saluting_face",
      "zipper_mouth_face",
      "face_with_raised_eyebrow",
      "neutral_face",
      "expressionless",
      "no_mouth",
      "dotted_line_face",
      "face_in_clouds",
      "smirk",
      "unamused",
      "face_with_rolling_eyes",
      "grimacing",
      "face_exhaling",
      "lying_face",
      "relieved",
      "pensive",
      "sleepy",
      "drooling_face",
      "sleeping",
      "mask",
      "face_with_thermometer",
      "face_with_head_bandage",
      "nauseated_face",
      "face_vomiting",
      "sneezing_face",
      "hot_face",
      "cold_face",
      "woozy_face",
      "dizzy_face",
      "face_with_spiral_eyes",
      "exploding_head",
      "face_with_cowboy_hat",
      "partying_face",
      "disguised_face",
      "sunglasses",
      "nerd_face",
      "face_with_monocle",
      "confused",
      "face_with_diagonal_mouth",
      "worried",
      "slightly_frowning_face",
      "white_frowning_face",
      "open_mouth",
      "hushed",
      "astonished",
      "flushed",
      "pleading_face",
      "face_holding_back_tears",
      "frowning",
      "anguished",
      "fearful",
      "cold_sweat",
      "disappointed_relieved",
      "cry",
      "sob",
      "scream",
      "confounded",
      "persevere",
      "disappointed",
      "sweat",
      "weary",
      "tired_face",
      "yawning_face",
      "triumph",
    ],
    []
  );
  const { tab } = useExpressionPicker();
  const { emojiNameMapping } = useAppSelector(selectAllEmojiData);
  const [emoji, setEmoji] = useState(emojiNameMapping["grinning"]);
  const [isEnter, setIsEnter] = useState(false);
  const isActive = isEnter || tab === "emoji";

  return (
    <ExpressionButton
      onMouseEnter={() => {
        setIsEnter(true);
        !isActive && setEmoji(emojiNameMapping[_.sample(emojiList) ?? "grinning"]);
      }}
      onMouseLeave={() => {
        setIsEnter(false);
      }}
      targetTab="emoji"
      className={classNames("transition-all duration-100", {
        grayscale: !isActive,
        "grayscale-0 scale-[1.15]": isActive,
      })}
    >
      <EmojiFromSprite width={22} height={22} emoji={emoji as StandardEmoji} />
    </ExpressionButton>
  );
};
