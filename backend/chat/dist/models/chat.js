import mongoose, { Schema, Types } from "mongoose";
const latestMessageSchema = new Schema({
    text: { type: Schema.Types.ObjectId, ref: "Message" },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
}, { _id: false });
const chatSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    latestMessage: latestMessageSchema,
}, { timestamps: true });
export const Chat = mongoose.model("Chat", chatSchema);
//# sourceMappingURL=Chat.js.map