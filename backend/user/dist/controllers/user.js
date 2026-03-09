import { pulishTOQuese } from "../configs/rabbitmq.js";
import { redisClient } from "../index.js";
import { asyncHandler } from "../utils/asynchandler.js";
export const loginUser = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    /* ---------------- RATE LIMIT ---------------- */
    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);
    if (rateLimit) {
        return res.status(429).json({
            message: "Too many requests. Try again later.",
        });
    }
    /* ---------------- GENERATE OTP ---------------- */
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    /* ---------------- STORE OTP ---------------- */
    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, otp, { EX: 180 }); // 3 minutes
    /* ---------------- RATE LIMIT SET ---------------- */
    await redisClient.set(rateLimitKey, "true", { EX: 60 }); // 1 minute
    /* ---------------- SEND TO QUEUE ---------------- */
    const message = {
        to: email,
        subject: "Your OTP Code",
        body: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    };
    await pulishTOQuese("send-otp", message);
    res.status(200).json({
        message: "OTP sent to your email",
    });
});
//# sourceMappingURL=user.js.map