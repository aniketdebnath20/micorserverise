import axios from "axios";
import { asyncHandler } from "../utils/asynchandler.js";
import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js";
export const createNewChat = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;
    if (!otherUserId) {
        return res.status(400).json({
            message: "Other user ID is required",
        });
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
        return res.status(409).json({
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
});
export const getAllchat = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(400).json({ message: "User id is missing" });
    }
    // 1️⃣ Get all chats of logged-in user
    const chats = await Chat.find({ users: userId })
        .sort({ updatedAt: -1 })
        .lean();
    // 2️⃣ Attach user + unseen count
    const chatWithUserData = await Promise.all(chats.map(async (chat) => {
        // find other user
        const otherUserId = chat.users.find((id) => id.toString() !== userId.toString());
        // unseen messages count
        const unseenCount = await Message.countDocuments({
            chatId: chat._id,
            sender: { $ne: userId },
            seen: false,
        });
        // fetch other user data (microservice)
        try {
            const { data } = await axios.get(`${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`);
            return {
                user: data,
                chat: {
                    ...chat,
                    latestMessage: chat.latestMessage || null,
                    unseenCount,
                },
            };
        }
        catch (error) {
            return {
                user: {
                    _id: otherUserId,
                    name: "Unknown User",
                },
                chat: {
                    ...chat,
                    latestMessage: chat.latestMessage || null,
                    unseenCount,
                },
            };
        }
    }));
    // 3️⃣ Send final response
    res.json({
        chats: chatWithUserData,
    });
});
export const sendMessage = asyncHandler(async (req, res) => {
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
    // 🔍 Validate chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }
    if (!chat.users.some((id) => id.toString() === senderId.toString())) {
        return res.status(403).json({ message: "Access denied" });
    }
    /* ---------------- MESSAGE DATA ---------------- */
    const messageData = {
        chatId,
        sender: senderId,
        text: text || "",
        messageType: imageFile ? "image" : "text",
        seen: false,
    };
    if (imageFile) {
        messageData.image = {
            url: imageFile.path,
            publicId: imageFile.filename,
        };
    }
    // 💾 Save message
    const savedMessage = await Message.create(messageData);
    // 🆕 Update latest message (store message ID – BEST PRACTICE)
    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: savedMessage._id,
        updatedAt: new Date(),
    });
    res.status(201).json({
        message: "Message sent successfully",
        data: savedMessage,
    });
});
//# sourceMappingURL=chat.js.map