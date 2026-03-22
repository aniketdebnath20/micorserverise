import mongoose, { Types, type Document } from "mongoose";
export interface IChat extends Document {
    users: Types.ObjectId[];
    latestMessage?: {
        text: Types.ObjectId;
        sender: Types.ObjectId;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const Chat: mongoose.Model<IChat, {}, {}, {}, mongoose.Document<unknown, {}, IChat, {}, mongoose.DefaultSchemaOptions> & IChat & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IChat>;
//# sourceMappingURL=Chat.d.ts.map