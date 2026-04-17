"use client";

import { useAppContextData } from "@/context/appcontext";
import AvatarCircle from "./avatara";
import { Chats, User } from "@/lib/types";
import { useSocket } from "@/context/socketcontext";

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
  const { user: loggedInUser } = useAppContextData();
  const { onlineUsers } = useSocket();

  const isOnline = onlineUsers?.includes(user._id);

  const latestMessage = ChatData?.chat?.latestMessage;
  const unseenCount = ChatData?.chat?.unseenCount || 0;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 text-left
        ${isActive ? "bg-primary/8 shadow-sm" : "hover:bg-muted"}`}
    >
      {/* Avatar */}
      <div className="relative">
        <AvatarCircle user={user} size="md" />

        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name + unread */}
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-semibold text-[13px] truncate text-foreground">
            {user.name}
          </span>

          {unseenCount > 0 && (
            <span className="flex-shrink-0 ml-2 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
              {unseenCount}
            </span>
          )}
        </div>

        {/* Latest Message */}
        {latestMessage ? (
          <p
            className={`text-xs truncate ${
              unseenCount > 0
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            }`}
          >
            {latestMessage.sender === loggedInUser?._id ? "You: " : ""}
            {latestMessage.text}
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