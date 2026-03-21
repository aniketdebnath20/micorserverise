"use client";

import { useState } from "react";
import ChatSidebar from "@/components/chatsidebar";
import ChatArea from "@/components/chatarear";
import { useIsMobile } from "@/hook/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useAppContextData } from "@/context/appcontext";
import { Chats } from "@/lib/types";
import axios from "axios";
import Cookies from "js-cookie";

const Chat = () => {
  const { users } = useAppContextData();

  const [activeFriendId, setActiveFriendId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);

  const isMobile = useIsMobile();

  const sendMessage = async (text: string) => {
    if (!chatId) {
      alert("id is required herer");
      return;
    } // chat must exist
    try {
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_SERVICES_ROUTE}/api/v1/message`,
        {
          chatId,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Append the new message to the current messages state
      setMessages((prev) => [...prev, data.data]);
    } catch (error: any) {
      console.error(
        "Failed to send message:",
        error.response?.data || error.message,
      );
    }
  };

  /* ---------------- CREATE CHAT ID---------------- */

  const createChat = async (friendId: string) => {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_SERVICES_ROUTE}/api/v1/chat/new`,
        { otherUserId: friendId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data.chatId;
    } catch (error: any) {
      console.error(
        "Failed to create chat:",
        error.response?.data || error.message,
      );

      if (error.response?.data?.chatId) {
        return error.response.data.chatId;
      }
    }
  };

  /* ---------------- FETCH MESSAGES ---------------- */

  const fetchChat = async (id: string) => {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_SERVICES_ROUTE}/api/v1/messages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Fetched messages:", data);

      setMessages(data.messages); // ✅ STORE IN STATE
    } catch (error) {
      console.log("Failed to fetch messages", error);
    }
  };

  /* ---------------- SELECT FRIEND ---------------- */
  /* ---------------- SELECT FRIEND ---------------- */

  const handleSelectFriend = async (friendId: string) => {
    setActiveFriendId(friendId);

    if (isMobile) setSidebarOpen(false);

    const id = await createChat(friendId); // returns chatId
    if (!id) return;

    setChatId(id); // store chatId in state
    await fetchChat(id);

    // DO NOT call sendMessage here unless you have text
    // sendMessage("Hello!", id); // ✅ only call with text
  };

  /* ---------------- FIND ACTIVE FRIEND ---------------- */

  const activeFriend = users?.find((u) => u._id === activeFriendId) || null;

  /* ---------------- UI ---------------- */

  const sidebar = (
    <ChatSidebar
      activeFriendId={activeFriendId}
      onSelectFriend={handleSelectFriend}
    />
  );

  return (
    <div className="flex h-screen bg-background">
      {!isMobile && sidebar}

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
        messages={messages}
        onSendMessage={sendMessage} // ✅ now actually sends text
        onOpenSidebar={isMobile ? () => setSidebarOpen(true) : undefined}
      />
    </div>
  );
};

export default Chat;
