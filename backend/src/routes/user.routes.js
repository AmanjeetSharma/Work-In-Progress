import express from "express";
import { getProfile, changePassword, deleteAccount, updateProfile, sendVerificationEmail, verifyEmail } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { listUserSessions } from "../controllers/user.controller.js";

const router = express.Router();

router.patch("/update-profile", verifyToken, upload.fields([{ name: "avatar", maxCount: 1 }]), updateProfile);
router.get("/profile", verifyToken, getProfile);
router.patch("/change-password", verifyToken, changePassword);
router.delete("/delete-account", verifyToken, deleteAccount);
router.get("/sessions", verifyToken, listUserSessions);

router.post("/send-verification/:userId", verifyToken, sendVerificationEmail);
router.get("/verify-email/:token", verifyEmail);


export default router;
