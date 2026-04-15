import jwt from "jsonwebtoken";
import { createHash } from "crypto";

interface TokenPayload {
  userId: number;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN!,
  } as jwt.SignOptions);
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,
  } as jwt.SignOptions);
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function getRefreshExpiryMs(): number {
  const days = parseInt(process.env.JWT_REFRESH_EXPIRES_IN!.slice(0, -1));
  return days * 24 * 60 * 60 * 1000;
}

export function verifyAccessToken(accessToken: string) {
  return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET!);
}

export function verifyRefreshToken(refreshToken: string) {
  return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
}
