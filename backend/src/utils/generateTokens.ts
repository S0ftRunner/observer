import { ACCESS_TOKEN_EXPIRY, JWT_SECRET, REFRESH_TOKEN_EXPIRY } from 'config';
import mongoose from 'mongoose';
import { TGeneratedTokens } from 'types/tokens';
import jwt from 'jsonwebtoken';

export const generateTokens = (id: mongoose.Types.ObjectId): TGeneratedTokens => {
  const accessTokenExpiry = ACCESS_TOKEN_EXPIRY;
  const refreshTokenExpiry = REFRESH_TOKEN_EXPIRY;
  const jwtSecret = JWT_SECRET;

  const accessToken = jwt.sign({ _id: id }, jwtSecret, {
    expiresIn: accessTokenExpiry as jwt.SignOptions['expiresIn'],
  });

  const refreshToken = jwt.sign({ _id: id }, jwtSecret, {
    expiresIn: refreshTokenExpiry as jwt.SignOptions['expiresIn'],
  });

  return {
    accessToken,
    refreshToken,
  };
};
