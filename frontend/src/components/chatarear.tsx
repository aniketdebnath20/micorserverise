"use client"

import { useState, useRef, useEffect } from "react";
import { Send, Smile, Paperclip, Phone, Video, MoreHorizontal, Menu } from "lucide-react";
import { Message, Friend } from "../smapledata";
import MessageBubble from "./messagebubble";
import AvatarCircle from "./avatara";

interface ChatAreaProps {
  friend: Friend | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onOpenSidebar?: () => void;
}

const ChatArea = ({ friend, messages, onSendMessage, onOpenSidebar }: ChatAreaProps) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Menu className="w-[18px] h-[18px]" />
            </button>
          </div>
        )}
        <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-up">
          <div className="w-24 h-24 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto mb-6 animate-float">
            <Send className="w-10 h-10 text-primary/40" />
          </div>
          <h2 className="text-2xl font-display font-bold mb-2 text-foreground">
            Pick a conversation
          </h2>
          <p className="text-muted-foreground text-sm max-w-[260px] mx-auto leading-relaxed">
            Choose someone from your list to start messaging
          </p>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Chat Header */}
      <div className="h-[68px] px-4 md:px-6 flex items-center justify-between border-b border-border bg-card">
        <div className="flex items-center gap-3">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Menu className="w-[18px] h-[18px]" />
            </button>
          )}
          <AvatarCircle user={friend} size="md" />
          <div>
            <h3 className="font-semibold text-sm">{friend.name}</h3>
            <p className="text-xs text-muted-foreground">
              {friend.status === "online"
                ? "Active now"
                : friend.status === "away"
                ? "Away"
                : friend.lastSeen
                ? `Last seen ${friend.lastSeen}`
                : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[Phone, Video, MoreHorizontal].map((Icon, i) => (
            <button
              key={i}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Icon className="w-[18px] h-[18px]" />
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 chat-scroll">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Paperclip className="w-[18px] h-[18px]" />
            </button>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Smile className="w-[18px] h-[18px]" />
            </button>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Write something..."
              className="w-full px-5 py-3 rounded-2xl bg-muted text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-11 h-11 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-primary/25 disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <Send className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
