import { verifyAccessToken } from "../utils/jwt.utils.js";
import ApiError from "../utils/api.errors.js";
export const authenticate = (req, _res, next) => {
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
        if (typeof decoded !== "object" ||
            decoded === null ||
            !("userId" in decoded) ||
            typeof decoded.userId !== "number") {
            return next(ApiError.unauthorized("Invalid token payload"));
        }
        req.user = { userId: decoded.userId };
        return next();
    }
    catch (_error) {
        return next(ApiError.unauthorized("Invalid or expired access token"));
    }
};
