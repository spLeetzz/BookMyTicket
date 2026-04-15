import type { RequestHandler } from "express";
import { verifyAccessToken } from "../utils/jwt.utils.js";
import ApiError from "../utils/api.errors.js";

interface AccessTokenPayload {
  userId: number;
}

export const authenticate: RequestHandler = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(ApiError.unauthorized("Missing authorization header"));
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return next(ApiError.unauthorized("Invalid authorization format"));
  }

  try {
    const decoded = verifyAccessToken(token);
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded) ||
      typeof decoded.userId !== "number"
    ) {
      return next(ApiError.unauthorized("Invalid token payload"));
    }

    (req as any).user = { userId: (decoded as AccessTokenPayload).userId };
    return next();
  } catch (_error) {
    return next(ApiError.unauthorized("Invalid or expired access token"));
  }
};
