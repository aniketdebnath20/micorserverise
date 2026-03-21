import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/databaseconnection.js";
import chatRoutes from "./routes/chat.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
const port = process.env.PORT || 5002;
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// cookie parser
app.use(cookieParser());
// router file
app.use("/api/v1", chatRoutes);
app.listen(port, () => {
    connectDB();
    console.log("🚀 Chat server running on port", port);
});
//# sourceMappingURL=index.js.map