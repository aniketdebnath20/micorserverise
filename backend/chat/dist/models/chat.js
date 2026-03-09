import mongoose, { Schema, Types } from "mongoose";
const chatSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    latestMessage: {
        text: { type: String },
        sender: { type: Schema.Types.ObjectId, ref: "User" },
    },
}, { timestamps: true });
export const Chat = mongoose.model("Chat", chatSchema);
//# sourceMappingURL=Chat.js.map