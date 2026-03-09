import { model, Schema } from "mongoose";
const messageSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: String,
    image: {
        url: String,
        publicId: String,
    },
    messageType: {
        type: String,
        enum: ["text", "image"],
        default: "text",
        required: true,
    },
    seen: { type: Boolean, default: false },
    seenAt: Date,
}, { timestamps: true });
export const Message = model("Message", messageSchema);
//# sourceMappingURL=Message.js.map