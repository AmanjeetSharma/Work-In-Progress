import crypto from "crypto";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import { resetPassHtml } from "../utils/email/resetPasswordEmail.js";






const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new ApiError(404, "User with this email does not exist");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = resetPassHtml(resetUrl);

    await sendEmail(user.email, "Password Reset Request", html, true);
    console.log(`📧➡️ Password reset email sent to ${user.email} by forgotPassword function`);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password reset link sent to email."));
});












const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
        throw new ApiError(400, "Token, new password, and confirm password are required");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "New password and confirm password do not match");
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired token");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    console.log(`✅🔐 Password for user ${user.email} has been reset.`);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password has been reset successfully."));
});



export { forgotPassword, resetPassword };