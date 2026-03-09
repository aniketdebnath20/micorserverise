import type { AuthenticatedRequest } from "../middleware/isauth.js";
import { pulishTOQuese } from "../configs/rabbitmq.js";
import { redisClient } from "../index.js";
import User from "../model/User.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { generateToken } from "../utils/jwt.js";

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

export const verifyUser = asyncHandler(async (req, res) => {
  const { email, otp: enteredOtp } = req.body;

  /* ---------------- VALIDATION ---------------- */
  if (!email || !enteredOtp) {
    return res.status(400).json({
      message: "Email and OTP are required",
    });
  }

  /* ---------------- GET OTP FROM REDIS ---------------- */
  const otpKey = `otp:${email}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp) {
    return res.status(400).json({
      message: "OTP expired or not found",
    });
  }

  if (storedOtp !== enteredOtp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  /* ---------------- DELETE OTP (ONE-TIME USE) ---------------- */
  await redisClient.del(otpKey);

  /* ---------------- FIND OR CREATE USER ---------------- */
  let user = await User.findOne({ email });

  if (!user) {
    const name = email.split("@")[0]; // better name
    user = await User.create({
      name,
      email,
    });
  }

  const token = generateToken(user);

  /* ---------------- SUCCESS ---------------- */
  res.status(200).json({
    message: "OTP verified successfully",
    user,
    token,
  });
});

export const MyProfile = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    if (!req.user?._id) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    // const user = await User.findById(req.user._id).select("-password");
    const user = req.user;
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json(user);
  },
);


export const updateProfile = asyncHandler(
  async (req: AuthenticatedRequest, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    await user.save();

    // const token = generateToken(user);

    res.json({
      message: "Profile updated successfully",
      user,
      // token
    });
  }
);


export const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});


export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    count: users.length,
    users,
  });
});