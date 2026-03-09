import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./configs/databaseconnection.js";
import { createClient } from "redis";
import userRoutes from "./routes/user.js";
import { connectRabbitMq } from "./configs/rabbitmq.js";

dotenv.config();
const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// // redis
export const redisClient = createClient({
  url: process.env.REDIS_URL!,
});

if (!redisClient) {
  throw new Error("REDIS_URL is not defined");
}
redisClient
  .connect()
  .then(() => console.log("conneted to the redis"))
  .catch(console.error);

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5000",
    credentials: true,
  })
);

// // rotuer routes
app.use("/api/v1", userRoutes);



app.listen(port, () => {
  connectDB();
  connectRabbitMq();
  console.log(`Server is running on port ${port}`);
});
