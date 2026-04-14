"use client";

import { SocketContextTypes } from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppContextData } from "./appcontext";

// Create context
const SocketContext = createContext<SocketContextTypes>({
  socket: null,
  onlineUsers: [],
});

// Provider component
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const { user } = useAppContextData();

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io("http://localhost:5002", {
      query: {
        userId: user._id, // replace with dynamic userId
      },
    });
    setSocket(newSocket);

    // Listen for online users
    newSocket.on("getOnlineUser", (users: string[]) => {
      setOnlineUsers(users);
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook
export const useSocket = () => {
  const context  = useContext(SocketContext);
  return context;
};
