import express from 'express';
import { register, login, refresh, logout, logoutAllDevices } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { forgotPassword, resetPassword } from '../controllers/password.controller.js';

const router = express.Router();


router.post('/register', upload.fields([{ name: "avatar", maxCount: 1 }]), register);
router.post('/login', login);
router.post('/refresh-token', refresh);
router.post('/logout', verifyToken, logout);
router.post('/logout-all', verifyToken, logoutAllDevices);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;  
