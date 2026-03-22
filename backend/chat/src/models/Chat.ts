import mongoose, { Schema, Types, type Document } from "mongoose";

export interface IChat extends Document {
  users: Types.ObjectId[];

  latestMessage?: {
    text: Types.ObjectId; // message ID
    sender: Types.ObjectId;
  };

  createdAt: Date;
  updatedAt: Date;
}

const latestMessageSchema = new Schema(
  {
    text: { type: Schema.Types.ObjectId, ref: "Message" },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

const chatSchema = new Schema<IChat>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    latestMessage: latestMessageSchema,
  },
  { timestamps: true },
);

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
