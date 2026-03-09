import express from "express";
import isAuth from "../middleware/isauth.js";
import { createNewChat, getAllchat, sendMessage } from "../controllers/chat.js";
import { upload } from "../middleware/multer.js";
const router = express.Router();
router.post("/chat/new", isAuth, createNewChat);
router.post("/chat/all", isAuth, getAllchat);
router.post("/message", isAuth, upload.single("image"), // 👈 field name = image
sendMessage);
export default router;
//# sourceMappingURL=chat.js.map