import { SignInPayloadSchema, SignUpPayloadSchema, } from "../schemas/user.schema.js";
import ApiError from "../../utils/api.errors.js";
import crypto from "crypto";
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    // controller method
    async processSignUp(req, res, next) {
        try {
            const parsed = SignUpPayloadSchema.parse(req.body);
            const data = await this.authService.register(parsed);
            this.setRefreshCookie(res, data.refreshToken, data.maxAge);
            return res.status(201).json({ accessToken: data.accessToken });
        }
        catch (error) {
            next(error);
        }
    }
    async processLogIn(req, res, next) {
        try {
            const parsed = SignInPayloadSchema.parse(req.body);
            const data = await this.authService.login(parsed);
            this.setRefreshCookie(res, data.refreshToken, data.maxAge);
            return res.status(200).json({ accessToken: data.accessToken });
        }
        catch (error) {
            next(error);
        }
    }
    async processLogOut(req, res, next) {
        try {
            if (req.cookies.refreshToken)
                await this.authService.logout(req.cookies.refreshToken);
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            });
            return res.status(200).json({ message: "Logged Out" });
        }
        catch (error) {
            next(error);
        }
    }
    async renewAccessToken(req, res, next) {
        try {
            if (!req.cookies.refreshToken) {
                throw ApiError.unauthorized("No Refresh Token");
            }
            const data = await this.authService.renewAccessToken(req.cookies.refreshToken);
            this.setRefreshCookie(res, data.refreshToken, data.maxAge);
            return res.status(200).json({ accessToken: data.accessToken });
        }
        catch (error) {
            next(error);
        }
    }
    googleAuth(req, res, next) {
        try {
            const state = crypto.randomBytes(16).toString("hex");
            req.session.oauthState = state;
            const url = this.authService.getGoogleRedirectUrl(state);
            res.redirect(url);
        }
        catch (error) {
            next(error);
        }
    }
    async googleAuthCallback(req, res, next) {
        try {
            const code = req.query.code;
            const state = req.query.state;
            if (typeof code !== "string" || typeof state !== "string") {
                throw ApiError.badRequest("Invalid OAuth callback");
            }
            const sessionState = req.session.oauthState;
            if (!sessionState || sessionState !== state) {
                throw ApiError.unauthorized("Invalid state");
            }
            const data = await this.authService.handleGoogleCallback({
                code,
            });
            delete req.session.oauthState;
            this.setRefreshCookie(res, data.refreshToken, data.maxAge);
            return res.status(200).json({ accessToken: data.accessToken });
        }
        catch (error) {
            next(error);
        }
    }
    setRefreshCookie(res, token, maxAge) {
        res.cookie("refreshToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge,
        });
    }
}
export default AuthController;
