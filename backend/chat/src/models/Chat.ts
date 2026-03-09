import mongoose, { Schema, Types, type Document } from "mongoose";

export interface IChat extends Document {
  users: Types.ObjectId[];

  latestMessage?: {
    text: string;
    sender: Types.ObjectId;
  };

  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    latestMessage: {
      text: { type: String },
      sender: { type: Schema.Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true },
);

export const Chat = mongoose.model<IChat>("Chat", chatSchema);
