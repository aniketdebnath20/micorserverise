"use client";

import { useState, useEffect } from "react";
import ChatSidebar from "@/components/chatsidebar";
import ChatArea from "@/components/chatarear";
import { useIsMobile } from "@/hook/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useAppContextData } from "@/context/appcontext";
import axios from "axios";
import Cookies from "js-cookie";
import { useSocket } from "@/context/socketcontext";

const Chat = () => {
  const { users, chats } = useAppContextData();
  const { socket, onlineUsers } = useSocket();

  const [activeFriendId, setActiveFriendId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("joinChat", chatId);

    return () => {
      socket.emit("leaveChat", chatId);
    };
  }, [socket, chatId]);

  /* ---------------- LISTEN NEW MESSAGE ---------------- */

  /* ---------------- TYPING LISTENER ---------------- */
  useEffect(() => {
    if (!socket) return;

    socket.on("userTyping", () => setIsTyping(true));
    socket.on("userStoppedTyping", () => setIsTyping(false));

    return () => {
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [socket]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = async (text: string) => {
    if (!chatId) return;

    socket?.emit("stopTyping", { chatId });

    try {
      const token = Cookies.get("token");

      await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_SERVICES_ROUTE}/api/v1/message`,
        { chatId, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: any) {
      console.error("Failed to send message:", error);
    }
  };

  /* ---------------- TYPING EMIT ---------------- */
  const handleTyping = () => {
    if (!socket || !chatId) return;

    socket.emit("typing", { chatId });

    setTimeout(() => {
      socket.emit("stopTyping", { chatId });
    }, 2000);
  };

  /* ---------------- CREATE CHAT ---------------- */
  const createChat = async (friendId: string) => {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_SERVICES_ROUTE}/api/v1/chat/new`,
        { otherUserId: friendId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return data.chatId;
    } catch (error: any) {
      if (error.response?.data?.chatId) {
        return error.response.data.chatId;
      }
    }
  };

  /* ---------------- FETCH CHAT ---------------- */
  const fetchChat = async (id: string) => {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_SERVICES_ROUTE}/api/v1/messages/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages(data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- SELECT FRIEND ---------------- */
  const handleSelectFriend = async (friendId: string) => {
    setActiveFriendId(friendId);

    if (isMobile) setSidebarOpen(false);

    const existingChat = chats?.find((c) => c.user._id === friendId);

    let id;

    if (existingChat) {
      id = existingChat.chat._id;
    } else {
      id = await createChat(friendId);
    }

    if (!id) return;

    setChatId(id);
    await fetchChat(id);
  };

  const activeFriend =
    users?.find((u) => u._id === activeFriendId) || null;

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
        onSendMessage={sendMessage}
        onTyping={handleTyping}
        isTyping={isTyping}
        onOpenSidebar={
          isMobile ? () => setSidebarOpen(true) : undefined
        }
      />
    </div>
  );
};

export default Chat;