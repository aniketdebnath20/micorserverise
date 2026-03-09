import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/databaseconnection.js";
import chatRoutes from "./routes/chat.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 5002;
// router file
app.use("/api/v1", chatRoutes);
app.listen(port, () => {
    connectDB();
    console.log("🚀 Chat server running on port", port);
});
//# sourceMappingURL=index.js.map