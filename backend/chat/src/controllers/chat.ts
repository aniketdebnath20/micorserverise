import axios from "axios";
import type { AuthenticatedRequest } from "../middleware/isauth.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";
import { getRecieverSocketId, io } from "../config/socket.js";
import { fstat } from "node:fs";

/* ================= CREATE CHAT ================= */

export const createNewChat = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ message: "Other user ID is required" });
    }

    if (userId?.toString() === otherUserId) {
      return res.status(400).json({
        message: "You cannot create a chat with yourself",
      });
    }

    const existingChat = await Chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existingChat) {
      return res.status(200).json({
        message: "Chat already exists",
        chatId: existingChat._id,
      });
    }

    const newChat = await Chat.create({
      users: [userId, otherUserId],
    });

    return res.status(201).json({
      message: "Chat created successfully",
      chatId: newChat._id,
    });
  },
);

/* ================= GET ALL CHATS ================= */

export const getAllchat = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(400).json({ message: "User id is missing" });
    }

    const chats = await Chat.find({ users: userId })
      .sort({ updatedAt: -1 })
      .populate({
        path: "latestMessage.text",
        select: "text sender createdAt",
      })
      .lean();

    const chatWithUserData = await Promise.all(
      chats.map(async (chat: any) => {
        const otherUserId = chat.users.find(
          (id: any) => id.toString() !== userId.toString(),
        );

        const unseenCount = await Message.countDocuments({
          chatId: chat._id,
          sender: { $ne: userId },
          seen: false,
        });

        let userData;
        try {
          const { data } = await axios.get(
            `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`,
          );
          userData = data;
        } catch {
          userData = { _id: otherUserId, name: "Unknown User" };
        }

        return {
          user: userData,
          chat: {
            _id: chat._id,
            users: chat.users,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            unseenCount,
            latestMessage: chat.latestMessage?.text
              ? {
                  _id: chat.latestMessage.text._id,
                  text: chat.latestMessage.text.text,
                  sender: chat.latestMessage.text.sender,
                  createdAt: chat.latestMessage.text.createdAt,
                }
              : null,
          },
        };
      }),
    );

    res.json({ chats: chatWithUserData });
  },
);

/* ================= SEND MESSAGE ================= */

export const sendMessage = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const senderId = req.user?._id;
    const { chatId, text } = req.body;
    const imageFile = req.file;

    if (!senderId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!chatId) {
      return res.status(400).json({ message: "chatId is required" });
    }

    if (!text && !imageFile) {
      return res.status(400).json({
        message: "Message text or image is required",
      });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.users.some((id: any) => id.toString() === senderId.toString())) {
      return res.status(403).json({ message: "Access denied" });
    }

    const receiverId = chat.users.find(
      (id: any) => id.toString() !== senderId.toString(),
    );

    let isReceiverInChatRoom = false;

    if (receiverId) {
      const receiverSocketId = getRecieverSocketId(receiverId.toString());

      if (receiverSocketId) {
        const receiverSocket = io.sockets.sockets.get(receiverSocketId);

        if (receiverSocket && receiverSocket.rooms.has(chatId)) {
          isReceiverInChatRoom = true;
        }
      }
    }

    const messageData: any = {
      chatId,
      sender: senderId,
      text: text || "",
      messageType: imageFile ? "image" : "text",
      seen: isReceiverInChatRoom,
      seenAt: isReceiverInChatRoom ? new Date() : undefined,
    };

    if (imageFile) {
      messageData.image = {
        url: imageFile.path,
        publicId: imageFile.filename,
      };
    }

    const savedMessage = await Message.create(messageData);

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: {
        text: savedMessage._id,
        sender: senderId,
      },
      updatedAt: new Date(),
    });

    io.to(chatId).emit("newMessage", savedMessage.toObject());

    res.status(201).json({
      message: "Message sent",
      data: savedMessage,
    });
  },
);

/* ================= GET MESSAGES ================= */

export const getMessagesByChat = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;
    const { chatId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!chatId) {
      return res.status(400).json({ message: "chatId is required" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.users.some((id: any) => id.toString() === userId.toString())) {
      return res.status(403).json({ message: "Access denied" });
    }

    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .lean();

    const messageToMarkSeen = await Message.find({
      chatId,
      sender: { $ne: userId },
      seen: false,
    });

    await Message.updateMany(
      {
        chatId,
        sender: { $ne: userId },
        seen: false,
      },
      {
        $set: {
          seen: true,
          seenAt: new Date(),
        },
      },
    );

    const otherUserId = chat.users.find(
      (id) => id.toString() !== userId.toString(),
    );

    let userData;
    try {
      const { data } = await axios.get(
        `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`,
      );
      userData = data;
    } catch {
      userData = { _id: otherUserId, name: "Unknown User" };
    }

    if (otherUserId && messageToMarkSeen.length > 0) {
      const otherUserSocketId = getRecieverSocketId(otherUserId.toString());

      if (otherUserSocketId) {
        io.to(otherUserSocketId).emit("messageSeen", {
          chatId,
          seenBy: userId,
          messageIds: messageToMarkSeen.map((msg) => msg._id),
        });
      }
    }

    res.status(200).json({
      messages,
      user: userData,
    });
  },
);