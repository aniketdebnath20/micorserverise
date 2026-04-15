import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap: Record<string, string> = {};

export const getRecieverSocketId = (recieverid: string): string | undefined => {
  return userSocketMap[recieverid];
};

// Listen for connections
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId as string | undefined;
  if (userId && userId !== undefined) {
    userSocketMap[userId] = socket.id;
    console.log(`user ${userId} and socket ${socket.id}`);
  }

  io.emit("getOnlineUser", Object.keys(userSocketMap));

  if (userId) socket.join(userId);


  socket.on("typing", ({ chatId }) => {
    console.log("typing the server socket id");
    socket.to(chatId).emit("userTyping");
  });

  socket.on("stopTyping", ({ chatId }) => {
    console.log("stoptyping the srever side socket io");
    socket.to(chatId).emit("userStoppedTyping");
  });

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log("jion chat ont he servertonsocket io");
  });

socket.on("leaveChat", (chatId) => {
  socket.leave(chatId);
  console.log("leave chat on server socket io");
});

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove user from map
    if (userId) {
      delete userSocketMap[userId];
      console.log(`user remove from the online ${userId}`);
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
  });

  socket.on("connect_error", (error) => {
    console.log("Soket connection Error", error);
  });
});

export { app, server, io };
