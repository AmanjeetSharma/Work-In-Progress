import jwt from 'jsonwebtoken';
import crypto from "crypto";

const generateSessionId = () => {
    return crypto.randomBytes(32).toString('hex'); // Unique, random 64-character hex string
};

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '15m'
        }
    );
};

const generateRefreshToken = (userId, sessionId) => {
    return jwt.sign(
        {
            id: userId, sessionId
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE || '7d'
        }
    );
};




const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};


export { generateSessionId, generateAccessToken, generateRefreshToken, generateVerificationToken };