import jwt from "jsonwebtoken";
import { createHash } from "crypto";
export function generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
}
export function generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
}
export function hashToken(token) {
    return createHash("sha256").update(token).digest("hex");
}
export function getRefreshExpiryMs() {
    const days = parseInt(process.env.JWT_REFRESH_EXPIRES_IN.slice(0, -1));
    return days * 24 * 60 * 60 * 1000;
}
export function verifyAccessToken(accessToken) {
    return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
}
export function verifyRefreshToken(refreshToken) {
    return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
}
