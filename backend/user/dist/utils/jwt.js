import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwt_secret = process.env.JWT_SECRET;
export const generateToken = (user) => {
    return jwt.sign({ user }, jwt_secret, { expiresIn: "14d" });
};
//# sourceMappingURL=jwt.js.map