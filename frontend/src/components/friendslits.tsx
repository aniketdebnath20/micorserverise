"use client";

import { useAppContextData } from "@/context/appcontext";
import AvatarCircle from "./avatara";
import { Chats, User } from "@/lib/types";

interface FriendListItemProps {
  ChatData?: Chats;
  user: User;
  isActive: boolean;
  onClick: () => void;
}

const FriendListItem = ({
  user,
  isActive,
  onClick,
  ChatData,
}: FriendListItemProps) => {
  console.log("fried luis chat datat", ChatData);
  console.log(" friend list chat datat is here", ChatData);
  console.log(ChatData?.chat);

  const { user: loggedInUser } = useAppContextData();

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-left
        ${isActive ? "bg-primary/8 shadow-sm" : "hover:bg-muted"}`}
    >
      <AvatarCircle user={user} size="md" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-semibold text-[13px] truncate text-foreground">
            {user.name}
          </span>
          {ChatData?.chat.unseenCount && ChatData.chat.unseenCount > 0 && (
            <span className="flex-shrink-0 ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
              {ChatData.chat.unseenCount}
            </span>
          )}
        </div>
        {ChatData?.chat?.latestMessage?.text ? (
          <p className="text-xs text-muted-foreground truncate">
            {ChatData.chat.latestMessage.sender === loggedInUser?._id
              ? "You: "
              : ""}
            {ChatData.chat.latestMessage.text}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No messages yet
          </p>
        )}
      </div>
    </button>
  );
};

export default FriendListItem;
