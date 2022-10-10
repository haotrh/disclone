import { Button, Divider } from "@app/common";
import { UserService } from "@services/user.service";
import classNames from "classnames";
import _ from "lodash";
import React, { ChangeEvent, useState } from "react";

const AddFriend = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<"success" | "error" | null>(null);

  const handleAddFriend = () => {
    UserService.addFriend(search.split("#")[0], search.split("#")[1])
      .then(() => setResult("success"))
      .catch(() => setResult("error"));
  };

  return (
    <div>
      <div className="px-8 py-5">
        <h2 className="text-white text-[17px] font-semibold mb-2">ADD FRIEND</h2>
        <div className="text-header-secondary text-sm mb-3">
          You can add a friend with their Discord Tag. It&apos;s cAsE sEnSitIvE!
        </div>
        <div
          className={classNames(
            "flex bg-background-tertiary px-3 py-2 border-black border",
            " rounded-lg",
            {
              "focus-within:border-blue-400": !result,
              "border-button-danger-normal": result === "error",
              "border-green-500": result === "success",
            }
          )}
        >
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setSearch(e.target.value);
              if (result) setResult(null);
            }}
            value={result === "success" ? "" : search}
            placeholder="Enter a Username#0000"
            className="flex-1 min-w-0 overflow-ellipsis bg-transparent placeholder-zinc-500 font-medium text-[17px]"
          />
          <Button
            className="flex-shrink-0"
            onClick={handleAddFriend}
            size="small"
            disabled={result === "success" || _.isEmpty(search)}
            grow
          >
            Send Friend Request
          </Button>
        </div>
        {result && (
          <div
            className={classNames("mt-1 text-sm", {
              "text-green-500": result === "success",
              "text-rose-400": result === "error",
            })}
          >
            {result === "success" && (
              <>
                Success! Your friend request to <span className="font-semibold">{search}</span> was
                sent.
              </>
            )}
            {result === "error" &&
              "Hm, didn't work. Double check that the capitalization, spelling, any spaces, and numbers are correct."}
          </div>
        )}
      </div>
      <Divider spacing="xs" />
    </div>
  );
};

export default AddFriend;
