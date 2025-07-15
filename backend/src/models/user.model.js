import mongoose, { Schema } from "mongoose";

const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    device: { type: String, default: 'Unknown Device' },
    refreshToken: String,
    firstLogin: { type: Date, default: Date.now },
    latestLogin: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
});

const userSchema = new Schema(
    {
        avatar: {
            type: String,   // cloudinary url
            required: false,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            // required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true, // So it does not conflict if empty
        },
        resetPasswordToken: {
            type: String,
            default: null
        },
        resetPasswordExpires: {
            type: Date,
            default: null
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        },
        verificationTokenExpiry: {
            type: Date,
        },
        role: {
            type: String,
            enum: ["USER", "ADMIN"],
            default: "USER"
        },
        sessions: [sessionSchema]
    }, { timestamps: true }
)

export const User = mongoose.model('User', userSchema);