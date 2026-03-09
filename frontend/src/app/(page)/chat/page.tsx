"use client"


import { useState } from "react";
import { Friend, Message, mockMessages } from "@/smapledata";
import ChatSidebar from "@/components/chatsidebar";
import ChatArea from "@/components/chatarear";
import { useIsMobile } from "@/hook/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const Chat = () => {
  const [activeFriend, setActiveFriend] = useState<Friend | null>(null);
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const currentMessages = activeFriend ? allMessages[activeFriend.id] || [] : [];

  const handleSelectFriend = (friend: Friend) => {
    setActiveFriend(friend);
    if (isMobile) setSidebarOpen(false);
  };

  const handleSendMessage = (text: string) => {
    if (!activeFriend) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "current",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };

    setAllMessages((prev) => ({
      ...prev,
      [activeFriend.id]: [...(prev[activeFriend.id] || []), newMsg],
    }));
  };

  const sidebar = (
    <ChatSidebar
      activeFriendId={activeFriend?.id || null}
      onSelectFriend={handleSelectFriend}
    />
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      {!isMobile && sidebar}

      {/* Mobile sidebar in sheet */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-[320px]">
            <SheetTitle className="sr-only">Chat sidebar</SheetTitle>
            {sidebar}
          </SheetContent>
        </Sheet>
      )}

      <ChatArea
        friend={activeFriend}
        messages={currentMessages}
        onSendMessage={handleSendMessage}
        onOpenSidebar={isMobile ? () => setSidebarOpen(true) : undefined}
      />
    </div>
  );
};

export default Chat;
