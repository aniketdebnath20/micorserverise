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

export const getRecieverSocketId = (
  recieverid: string,
): string | undefined => {
  return userSocketMap[recieverid];
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId as string | undefined;

  if (userId) {
    userSocketMap[userId] = socket.id;
    socket.join(userId);
  }

  io.emit("getOnlineUser", Object.keys(userSocketMap));

  socket.on("joinChat", (chatId: string) => {
    socket.join(chatId);
    console.log("joined chat:", chatId);
  });

  socket.on("leaveChat", (chatId: string) => {
    socket.leave(chatId);
    console.log("left chat:", chatId);
  });

  socket.on("typing", ({ chatId, userId }) => {
    socket.to(chatId).emit("userTyping", { chatId, userId });
  });

  socket.on("stopTyping", ({ chatId, userId }) => {
    socket.to(chatId).emit("userStoppedTyping", { chatId, userId });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
  });

  socket.on("connect_error", (error) => {
    console.log("Socket connection error", error);
  });
});

export { app, server, io };