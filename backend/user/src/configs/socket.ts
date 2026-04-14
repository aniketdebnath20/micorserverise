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

  // socket.on("typing", (data) => {
  //   console.log("typing the server socket id");
  //   socket.to(data.chatId).emit("userTyping", {
  //     chatId: data.chatId,
  //     userId: data.userId,
  //   });
  // });

  // socket.on("stopTyping", (data) => {
  //   console.log("stoptyping the srever side socket io");
  //   socket.to(data.chatId).emit("userStoppedTyping", {
  //     chatId: data.chatId,
  //     userId: data.userId,
  //   });
  // });

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
    socket.join(chatId);
    console.log("leagy ;efy leave chat ont he servertonsocket io");
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
