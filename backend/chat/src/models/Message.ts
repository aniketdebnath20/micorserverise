import { model, Schema, type Document, type Types } from "mongoose";

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  sender: Types.ObjectId;

  text?: string;

  image?: {
    url: string;
    publicId: string;
  };

  messageType: "text" | "image";

  seen: boolean;
  seenAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
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
  },
  { timestamps: true },
);

export const Message = model<IMessage>("Message", messageSchema);
