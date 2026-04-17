"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  MoreHorizontal,
  Menu,
} from "lucide-react";
import MessageBubble from "./messagebubble";
import AvatarCircle from "./avatara";
import { Message, User } from "@/lib/types";
import { useAppContextData } from "@/context/appcontext";
import { useSocket } from "@/context/socketcontext";

interface ChatAreaProps {
  friend: User | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onTyping: () => void;
  isTyping: boolean;
  onOpenSidebar?: () => void;
}

const ChatArea = ({
  friend,
  messages = [],
  onSendMessage,
  onOpenSidebar,
  onTyping,
  isTyping,
}: ChatAreaProps) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAppContextData();
  const { onlineUsers } = useSocket();

  const currentUserId = user?._id;
  const isFriendOnline = friend ? onlineUsers.includes(friend._id) : false;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = newMessage.trim();
    if (!text) return;

    onSendMessage(text);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!friend) {
    return (
      <div className="flex-1 flex flex-col bg-background dot-pattern">
        {onOpenSidebar && (
          <div className="h-[68px] px-4 flex items-center border-b border-border bg-card">
            <button
              onClick={onOpenSidebar}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted"
            >
              <Menu className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto mb-6">
              <Send className="w-10 h-10 text-primary/40" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Pick a conversation</h2>

            <p className="text-muted-foreground text-sm max-w-[260px] mx-auto">
              Choose someone from your list to start messaging
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-[68px] px-4 md:px-6 flex items-center justify-between border-b border-border bg-card">
        <div className="flex items-center gap-3">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted"
            >
              <Menu className="w-[18px] h-[18px]" />
            </button>
          )}

          <AvatarCircle user={friend} size="md" />

          <div>
            <h3 className="font-semibold text-sm">{friend.name}</h3>
            <p className="text-xs text-muted-foreground">
              {isFriendOnline
                ? "Active now"
                : friend.status === "away"
                  ? "Away"
                  : "Offline"}
            </p>
            {isTyping && (
              <div className="text-xs text-muted-foreground">typing...</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[Phone, Video, MoreHorizontal].map((Icon, i) => (
            <button
              key={i}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted"
            >
              <Icon className="w-[18px] h-[18px]" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 chat-scroll">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No messages yet
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            currentUserId={currentUserId}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-5 py-4 border-t border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted">
              <Paperclip className="w-[18px] h-[18px]" />
            </button>

            <button className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-muted">
              <Smile className="w-[18px] h-[18px]" />
            </button>
          </div>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              if (e.target.value.trim()) {
                onTyping();
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Write something..."
            className="flex-1 px-5 py-3 rounded-2xl bg-muted text-sm outline-none"
          />

          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40"
          >
            <Send className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;