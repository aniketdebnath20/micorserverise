"use client";

import { useState } from "react";
import { Search, Settings, LogOut } from "lucide-react";
import FriendListItem from "./friendslits";
import AvatarCircle from "./avatara";
import { useAppContextData } from "@/context/appcontext";
import { User, Chats } from "@/lib/types";
import { useMemo } from "react";

interface ChatSidebarProps {
  activeFriendId: string | null;
  onSelectFriend: (friendId: string) => void;
}

const ChatSidebar = ({ activeFriendId, onSelectFriend }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { users, user: loggedInUser, chats, logoutUser } = useAppContextData();
  console.log(chats)
  console.log(chats)
  console.log(chats)
  console.log(chats)

  const filteredFriends: User[] = useMemo(() => {
    if (!users || !loggedInUser) return [];
    return users.filter(
      (u) =>
        u._id !== loggedInUser._id &&
        u.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [users, searchQuery, loggedInUser]);

  console.log("users:", users);
  console.log("searchQuery:", searchQuery);
  console.log(filteredFriends);
  console.log(loggedInUser);

  return (
    <div className="w-full md:w-[340px] bg-card flex flex-col h-full border-r border-border">
      {/* Profile Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <AvatarCircle user={loggedInUser!} size="md" showStatus={false} />
            <div>
              <h2 className="font-semibold text-sm">My Chats</h2>
              <p className="text-xs text-muted-foreground">
                {filteredFriends?.length || 0} friends online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => logoutUser()}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Friend List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 chat-scroll space-y-0.5">
        {filteredFriends?.map((friend) => {
          const friendChat: Chats | undefined = Array.isArray(chats)
            ? chats.find((c) => c.user._id === friend._id)
            : undefined;
          return (
            <FriendListItem
              key={friend._id}
              user={friend}
              ChatData={friendChat}
              isActive={activeFriendId === friend._id}
              onClick={() => onSelectFriend(friend._id)}
            />
          );
        })}
        {filteredFriends?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
