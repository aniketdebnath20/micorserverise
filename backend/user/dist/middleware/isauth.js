import jwt, {} from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const isAuth = async (req, res, next) => {
    try {
        /* ---------------- GET AUTH HEADER ---------------- */
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization token missing",
            });
        }
        /* ---------------- EXTRACT TOKEN ---------------- */
        const token = authHeader.split(" ")[1];
        /* ---------------- VERIFY TOKEN ---------------- */
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        /* ---------------- ATTACH USER TO REQUEST ---------------- */
        req.user = decoded.user;
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};
//# sourceMappingURL=isauth.js.map