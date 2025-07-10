import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js'
import jwt from 'jsonwebtoken';

const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, 'Access token is missing. Unauthorized request');
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid or expired access token");
  }

  const user = await User.findById(decodedToken?._id).select("-password -sessions");
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  req.user = user;
  next();
});


export { verifyToken };