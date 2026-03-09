"use client"

import { useState } from "react";
import { Search, Users, MessageSquare, Settings, LogOut } from "lucide-react";
// import { useNavigate } from "react-router-dom";
import { Friend, mockFriends } from "@/smapledata";
import FriendListItem from "./friendslits";
import AvatarCircle from "./avatara";
import { mockCurrentUser } from "@/smapledata";

interface ChatSidebarProps {
  activeFriendId: string | null;
  onSelectFriend: (friend: Friend) => void;
}

const ChatSidebar = ({ activeFriendId, onSelectFriend }: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"chats" | "friends">("chats");
  // const navigate = useNavigate();

  const filteredFriends = mockFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineFriends = mockFriends.filter((f) => f.status === "online");

  return (
    <div className="w-full md:w-[340px] bg-card flex flex-col h-full border-r border-border">
      {/* Profile header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <AvatarCircle user={mockCurrentUser} size="md" showStatus={false} />
            <div>
              <h2 className="font-semibold text-sm">My Chats</h2>
              <p className="text-xs text-muted-foreground">
                {onlineFriends.length} friends online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button
              // onClick={() => navigate("/")}
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

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("chats")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === "chats"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Messages
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              activeTab === "friends"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Friends
            <span className={`min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center ${
              activeTab === "friends"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/10 text-primary"
            }`}>
              {onlineFriends.length}
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-5" />

      {/* Friend List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 chat-scroll">
        {activeTab === "friends" && (
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-2">
            Online now
          </p>
        )}

        <div className="space-y-0.5">
          {(activeTab === "friends"
            ? [...filteredFriends].sort((a, b) => {
                const order = { online: 0, away: 1, offline: 2 };
                return order[a.status] - order[b.status];
              })
            : filteredFriends
          ).map((friend) => (
            <FriendListItem
              key={friend.id}
              friend={friend}
              isActive={activeFriendId === friend.id}
              onClick={() => onSelectFriend(friend)}
            />
          ))}
        </div>

        {filteredFriends.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
