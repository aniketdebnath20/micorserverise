"use client";

import { useState, useEffect, useRef } from "react";
import ChatSidebar from "@/components/chatsidebar";
import ChatArea from "@/components/chatarear";
import { useIsMobile } from "@/hook/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useAppContextData } from "@/context/appcontext";
import axios from "axios";
import Cookies from "js-cookie";
import { useSocket } from "@/context/socketcontext";

const Chat = () => {
  const { users, chats, setChats, user: loggedInUser } = useAppContextData();
  const { socket, onlineUsers } = useSocket();

  const [activeFriendId, setActiveFriendId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("joinChat", chatId);

    return () => {
      socket.emit("leaveChat", chatId);
    };
  }, [socket, chatId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: any) => {
      if (!message?.chatId) return;

      setChats((prev) => {
        if (!prev) return prev;

        const next = [...prev];
        const idx = next.findIndex((item) => item.chat._id === message.chatId);

        if (idx === -1) return prev;

        const [current] = next.splice(idx, 1);

        const updated = {
          ...current,
          chat: {
            ...current.chat,
            latestMessage: {
              _id: message._id,
              text: message.text,
              sender: message.sender,
              createdAt: message.createdAt,
            },
            unseenCount:
              message.sender !== loggedInUser?._id &&
              message.chatId !== chatId
                ? (current.chat.unseenCount || 0) + 1
                : current.chat.unseenCount || 0,
          },
        };

        next.unshift(updated);
        return next;
      });

      setMessages((prev) => {
        if (message.chatId !== chatId) return prev;
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });

      if (message.chatId === chatId) {
        setIsTyping(false);
        setChats((prev) => {
          if (!prev) return prev;
          return prev.map((item) =>
            item.chat._id === chatId
              ? {
                  ...item,
                  chat: {
                    ...item.chat,
                    unseenCount: 0,
                  },
                }
              : item,
          );
        });
      }
    };

    const handleMessageSeen = (data: any) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => {
        return prev.map((msg) => {
          const shouldMarkSeen =
            msg.sender === loggedInUser?._id &&
            data.messageIds?.includes(msg._id);

          return shouldMarkSeen
            ? {
                ...msg,
                seen: true,
                seenAt: new Date().toISOString(),
              }
            : msg;
        });
      });

      setChats((prev) => {
        if (!prev) return prev;
        return prev.map((item) =>
          item.chat._id === chatId
            ? {
                ...item,
                chat: {
                  ...item.chat,
                  unseenCount: 0,
                },
              }
            : item,
        );
      });
    };

    const handleUserTyping = (data: { chatId: string; userId: string }) => {
      if (data.chatId === chatId && data.userId !== loggedInUser?._id) {
        setIsTyping(true);
      }
    };

    const handleUserStoppedTyping = (
      data: { chatId: string; userId: string },
    ) => {
      if (data.chatId === chatId && data.userId !== loggedInUser?._id) {
        setIsTyping(false);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageSeen", handleMessageSeen);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageSeen", handleMessageSeen);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [socket, chatId, loggedInUser?._id, setChats]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const sendMessage = async (text: string) => {
    if (!chatId) return;

    socket?.emit("stopTyping", {
      chatId,
      userId: loggedInUser?._id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    try {
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_SERVICES_ROUTE}/api/v1/message`,
        { chatId, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const sentMessage = data.data;

      setMessages((prev) => {
        if (prev.some((m) => m._id === sentMessage._id)) return prev;
        return [...prev, sentMessage];
      });
    } catch (error: any) {
      console.error(
        "Failed to send message:",
        error.response?.data || error.message,
      );
    }
  };

  const handleTyping = () => {
    if (!socket || !chatId || !loggedInUser?._id) return;

    socket.emit("typing", {
      chatId,
      userId: loggedInUser._id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        chatId,
        userId: loggedInUser._id,
      });
    }, 1200);
  };

  const createChat = async (friendId: string) => {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_CHAT_SERVICES_ROUTE}/api/v1/chat/new`,
        { otherUserId: friendId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      return data.chatId as string;
    } catch (error: any) {
      console.error(
        "Failed to create chat:",
        error.response?.data || error.message,
      );

      if (error.response?.data?.chatId) {
        return error.response.data.chatId as string;
      }
    }
  };

  const fetchChat = async (id: string) => {
    try {
      const token = Cookies.get("token");

      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_CHAT_SERVICES_ROUTE}/api/v1/messages/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setMessages(data.messages);
      setIsTyping(false);
    } catch (error) {
      console.log("Failed to fetch messages", error);
    }
  };

  const handleSelectFriend = async (friendId: string) => {
    setActiveFriendId(friendId);

    if (isMobile) setSidebarOpen(false);

    const existingChat = chats?.find((c) => c.user._id === friendId);
    const id = existingChat ? existingChat.chat._id : await createChat(friendId);

    if (!id) return;

    setChatId(id);
    setMessages([]);
    setIsTyping(false);
    await fetchChat(id);
  };

  const activeFriend = users?.find((u) => u._id === activeFriendId) || null;

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
        onOpenSidebar={isMobile ? () => setSidebarOpen(true) : undefined}
      />
    </div>
  );
};

export default Chat;