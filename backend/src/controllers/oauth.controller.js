import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user.model.js';
import { generateAccessToken, generateRefreshToken, generateSessionId } from '../utils/token.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = asyncHandler(async (req, res) => {
  const { tokenId, device } = req.body;

  if (!tokenId) {
    throw new ApiError(400, "No Google token provided");
  }

  // console.log("✅ Google token received:", tokenId);

  const ticket = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { email, name, sub: googleId, picture } = payload;

  let user = await User.findOne({ googleId });

  if (!user) {
    user = await User.findOne({ email });

    if (user) {
      user.googleId = googleId;
      await user.save();
    } else {
      user = await User.create({
        email,
        username: email.split("@")[0].replace(/\d+/g, "") + Math.floor(1000 + Math.random() * 90000),
        name,
        password: null,
        isVerified: true,
        avatar: picture || "",
        googleId,
        sessions: [],
      });
    }
  }

  const sessionId = generateSessionId();
  const refreshToken = generateRefreshToken(user._id, sessionId);
  const accessToken = generateAccessToken(user);

  let existingSession = user.sessions.find(
    (s) => s.device === (device || "Google Device")
  );

  if (existingSession) {
    existingSession.sessionId = sessionId;
    existingSession.refreshToken = refreshToken;
    existingSession.latestLogin = new Date();
    existingSession.isActive = true;
  } else {
    const newSession = {
      sessionId,
      device: device || "Google Device",
      refreshToken,
      firstLogin: new Date(),
      latestLogin: new Date(),
      isActive: true,
    };
    user.sessions.push(newSession);
  }

  await user.save();

  const options = {
    httpOnly: true,
    secure: true, // set true in prod
    sameSite: 'None',
    Path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
          },
        },
        "✅ User logged in successfully via Google"
      )
    );

  console.log(`✅ ${user.username} logged in via Google (${device || "Google Device"})`);
});
