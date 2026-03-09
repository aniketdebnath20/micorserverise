import express from "express";
import dotenv from "dotenv";
import { startSendOTPConsumer } from "./controller/user.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 5001;
app.listen(port, () => {
    console.log("🚀 Mail server running on port", port);
    startSendOTPConsumer();
});
//# sourceMappingURL=index.js.map