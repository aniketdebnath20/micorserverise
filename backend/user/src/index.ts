import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./configs/databaseconnection.js";
import { createClient } from "redis";
import userRoutes from "./routes/user.js";
import { connectRabbitMq } from "./configs/rabbitmq.js";
import type { Request, Response, NextFunction } from "express";
import { app, server } from "./configs/socket.js";

dotenv.config();

// const app = express();
const port = process.env.PORT || 5000;

/* CORS */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

/* Body Parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* Redis */
if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not defined");
}

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient
  .connect()
  .then(() => console.log("✅ Connected to Redis"))
  .catch(console.error);

/* Routes */
app.use("/api/v1", userRoutes);

/* JSON Error Handler */
// app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
//   if (err instanceof SyntaxError) {
//     return res.status(400).json({ message: "Invalid JSON format" });
//   }
//   next(err);
// });

/* Start Server */
server.listen(port, () => {
  connectDB();
  connectRabbitMq();
  console.log(`🚀 Server running on port ${port}`);
});