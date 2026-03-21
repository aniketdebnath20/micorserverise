import express from "express";
import {
  getAllUsers,
  getSingleUser,
  loginUser,
  MyProfile,
  updateProfile,
  verifyUser,
} from "../controllers/user.js";
import { isAuth } from "../middleware/isauth.js";

const router = express.Router();
router.post("/login", loginUser);
router.post("/verify", verifyUser);

router.get("/me", isAuth, MyProfile);

router.post("/update/user", isAuth, updateProfile);
router.get("/user/:id", getSingleUser);
router.get("/users/all", isAuth, getAllUsers);
export default router;
