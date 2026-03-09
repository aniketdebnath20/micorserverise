import mongoose, { Document, Schema } from "mongoose";
const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
}, { timestamps: true });
const User = mongoose.model("User", schema);
export default User;
//# sourceMappingURL=User.js.map