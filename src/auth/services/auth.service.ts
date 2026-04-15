import type {
  AuthServiceDto,
  LoginUserDto,
  RegisterUserDto,
} from "../interfaces/auth.interfaces.js";
import { hash, compare } from "bcryptjs";
import UserRepository from "../repositories/user.repository.js";
import TokenRepository from "../repositories/token.repository.js";
import ApiError from "../../utils/api.errors.js";
import * as jwt from "../../utils/jwt.utils.js";

class AuthService implements AuthServiceDto {
  constructor(
    private userRepo: UserRepository,
    private tokenRepo: TokenRepository,
  ) {}

  async login(data: LoginUserDto): Promise<any> {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) throw ApiError.unauthorized("Invalid credentials");

    const isValid = await compare(data.password, user.passwordHash!);
    if (!isValid) throw ApiError.unauthorized("Incorrect Password");
    // intentionally different message for password as this app isnt crazy security concerned.

    return await this.generateTokenPair(user.id);
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenHash = jwt.hashToken(refreshToken);
    await this.tokenRepo.deleteByHash(tokenHash);
  }

  async register(data: RegisterUserDto): Promise<any> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw ApiError.conflict("Email already in use");

    const passwordHash = await hash(data.password, 10);

    const user = await this.userRepo.createUser({
      firstName: data.firstName,
      lastName: data.lastName ?? undefined,
      email: data.email,
      passwordHash: passwordHash,
    });

    return await this.generateTokenPair(user.id);
  }

  async renewAccessToken(refreshToken: string): Promise<any> {
    const payload = jwt.verifyRefreshToken(refreshToken) as { userId: number };

    const tokenHash = jwt.hashToken(refreshToken);
    const deleted = await this.tokenRepo.deleteByHash(tokenHash);

    if (!deleted) {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    return await this.generateTokenPair(payload.userId);
  }

  public getGoogleRedirectUrl(state: string): string {
    return (
      "https://accounts.google.com/o/oauth2/v2/auth" +
      `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}` +
      `&response_type=code` +
      `&scope=openid%20email%20profile` +
      `&state=${state}`
    );
  }

  async handleGoogleCallback({ code }: { code: string }) {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (!(tokens as any)?.access_token) {
      throw ApiError.badRequest("Google token exchange failed");
    }

    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${(tokens as any).access_token}`,
        },
      },
    );

    const googleUser = await userRes.json();
    const { email, given_name, family_name, name } = googleUser as any;

    const firstName = given_name || name?.split(" ")[0] || "";
    const lastName = family_name || name?.split(" ").slice(1).join(" ") || "";

    if (!email) {
      throw ApiError.badRequest("Google email missing");
    }

    let user = await this.userRepo.findByEmail(email);

    if (!user) {
      user = await this.userRepo.createUser({
        firstName,
        lastName: lastName ?? undefined,
        email: email,
      });
    }

    return await this.generateTokenPair(user.id);
  }

  private async generateTokenPair(userId: number) {
    const payload = { userId };
    const accessToken = jwt.generateAccessToken(payload);
    const refreshToken = jwt.generateRefreshToken(payload);
    const expiryMs = jwt.getRefreshExpiryMs();

    await this.tokenRepo.pushToken({
      userId,
      tokenHash: jwt.hashToken(refreshToken), // hash before storing
      expiresAt: new Date(Date.now() + expiryMs).toISOString(),
    });

    return {
      accessToken,
      refreshToken,
      maxAge: expiryMs,
    };
  }
}

export default AuthService;
