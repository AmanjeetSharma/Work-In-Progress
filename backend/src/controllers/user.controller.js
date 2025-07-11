import fs from "fs";
import bcrypt from "bcrypt";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { usernameValidator, avatarValidator } from "../utils/validators.js";
import { verificationEmail } from "../utils/email/verificationEmail.js";
import sendEmail from "../utils/sendEmail.js";
import { generateVerificationToken } from "../utils/token.js";

const updateProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const { username, name } = req.body;

    if (username && !usernameValidator(username)) {
        throw new ApiError(400, "Username must be 3-20 chars, only letters, numbers, or underscores and cannot have spaces.");
    }

    if (name && name.trim().length < 2) {
        throw new ApiError(400, "Name must be at least 2 characters long");
    }

    const avatarFile = req?.files?.avatar?.[0];
    if (avatarFile && !avatarValidator(avatarFile)) {
        fs.unlinkSync(avatarFile.path);
        throw new ApiError(400, "Invalid avatar: must be JPEG/PNG/WebP and ≤ 5 MB");
    }

    if (username) user.username = username.toLowerCase();
    if (name) user.name = name.trim();

    if (avatarFile) {
        let avatarResult = await uploadOnCloudinary(avatarFile.path, "Work-in-Progress/users/avatars");
        if (!avatarResult) {
            throw new ApiError(500, "⚠️ Error uploading avatar image");
        }
        user.avatar = avatarResult.url;
    }
    await user.save();

    const updatedUser = await User.findById(user._id).select("-password -sessions");
    console.log("✅  User profile updated:", updatedUser.username);
    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "✅ Profile updated successfully"));
});









const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -sessions");
    console.log("Fetching user profile for:", user);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    console.log("✅  User profile fetched:", user.username);
    return res
        .status(200)
        .json(new ApiResponse(200, user, "✅ User profile fetched successfully"));
});







const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        throw new ApiError(400, "Old password, new password, and confirmation are required");
    }

    if (newPassword.length < 8) {
        throw new ApiError(400, "New password must be at least 8 characters long");
    }

    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
    if (!complexityRegex.test(newPassword)) {
        throw new ApiError(
            400,
            "New password must include uppercase, lowercase, number, and special character"
        );
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New password and confirmation do not match");
    }

    const user = await User.findById(req.user._id).select("+password +sessions");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 🟢 New check: ensure user actually has a password set
    if (!user.password) {
        throw new ApiError(400, "You do not have a password set. Please use Google login to continue.");
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
        throw new ApiError(400, "New password must be different from the old password");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = await bcrypt.hash(newPassword, 10);

    user.sessions.forEach((session) => {
        session.isActive = false;
        session.refreshToken = null;
    });

    await user.save();

    const options = {
        httpOnly: true,
        secure: false, // true in prod
        sameSite: 'strict',
    };

    console.log("✅ Password changed and all sessions invalidated for user:", user.username);
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "✅ Password changed and all sessions invalidated. Please log in again."));
});










const deleteAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    await user.deleteOne();

    console.log("✅  User account deleted:", user.username);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "✅ Account deleted successfully"));
});








const listUserSessions = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const sessions = user.sessions.map((session) => ({
        sessionId: session.sessionId,
        device: session.device,
        firstLogin: session.firstLogin,
        latestLogin: session.latestLogin,
        isActive: session.isActive,
    }));

    console.log(
        `✅  User sessions listed for: "${user.username}" . Sessions status: `,
        sessions.map(s => `${s.device} : ${s.isActive}`).join(", ")
    );
    return res
        .status(200)
        .json(new ApiResponse(200, sessions, "✅ User sessions listed successfully"));
});









const sendVerificationEmail = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const token = generateVerificationToken();
    user.verificationToken = token;
    user.verificationTokenExpiry = Date.now() + 1000 * 60 * 30; // 30 min validity
    await user.save();

    const emailContent = verificationEmail(token);
    await sendEmail(user.email, "Verify your email", emailContent, true);

    res.status(200).json(new ApiResponse(200, {}, "Verification email sent"));
});

const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: Date.now() },
    });

    if (!user) throw new ApiError(400, "Invalid or expired token");

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.redirect(`${process.env.FRONTEND_URL}/profile?verified=true`);
});


export { updateProfile, getProfile, changePassword, deleteAccount, listUserSessions, sendVerificationEmail, verifyEmail };