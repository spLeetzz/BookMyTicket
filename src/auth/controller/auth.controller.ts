import type { AuthServiceDto } from "../interfaces/auth.interfaces.js";
import type { Request, Response, NextFunction } from "express";
import {
  SignInPayloadSchema,
  SignUpPayloadSchema,
} from "../schemas/user.schema.js";
import ApiError from "../../utils/api.errors.js";
import crypto from "crypto";

class AuthController {
  constructor(private authService: AuthServiceDto) {}

  // controller method
  async processSignUp(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = SignUpPayloadSchema.parse(req.body);
      const data = await this.authService.register(parsed);

      this.setRefreshCookie(res, data.refreshToken, data.maxAge);

      return res.status(201).json({ accessToken: data.accessToken });
    } catch (error) {
      next(error);
    }
  }

  async processLogIn(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = SignInPayloadSchema.parse(req.body);
      const data = await this.authService.login(parsed as any);

      this.setRefreshCookie(res, data.refreshToken, data.maxAge);

      return res.status(200).json({ accessToken: data.accessToken });
    } catch (error) {
      next(error);
    }
  }

  async processLogOut(req: Request, res: Response, next: NextFunction) {
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
    } catch (error) {
      next(error);
    }
  }

  async renewAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.cookies.refreshToken) {
        throw ApiError.unauthorized("No Refresh Token");
      }

      const data = await this.authService.renewAccessToken(
        req.cookies.refreshToken,
      );

      this.setRefreshCookie(res, data.refreshToken, data.maxAge);

      return res.status(200).json({ accessToken: data.accessToken });
    } catch (error) {
      next(error);
    }
  }

  googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const state = crypto.randomBytes(16).toString("hex");
      (req.session as any).oauthState = state;

      const url = this.authService.getGoogleRedirectUrl(state);

      res.redirect(url);
    } catch (error) {
      next(error);
    }
  }

  async googleAuthCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const code = req.query.code;
      const state = req.query.state;

      if (typeof code !== "string" || typeof state !== "string") {
        throw ApiError.badRequest("Invalid OAuth callback");
      }

      const sessionState = (req.session as any).oauthState;

      if (!sessionState || sessionState !== state) {
        throw ApiError.unauthorized("Invalid state");
      }

      const data = await this.authService.handleGoogleCallback({
        code,
      });

      delete (req.session as any).oauthState;

      this.setRefreshCookie(res, data.refreshToken, data.maxAge);

      return res.status(200).json({ accessToken: data.accessToken });
    } catch (error) {
      next(error);
    }
  }

  private setRefreshCookie(res: Response, token: string, maxAge: number) {
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
