import { Router } from "express";
import AuthController from "../controller/auth.controller.js";
import AuthService from "../services/auth.service.js";
import UserRepository from "../repositories/user.repository.js";
import TokenRepository from "../repositories/token.repository.js";
import { db } from "../../db/index.js";

const router = Router();

const userRepo = new UserRepository(db);
const tokenRepo = new TokenRepository(db);
const authService = new AuthService(userRepo, tokenRepo);
const authController = new AuthController(authService);

router.post("/auth/login", authController.processLogIn.bind(authController));

router.post(
  "/auth/register",
  authController.processSignUp.bind(authController),
);

router.post("/auth/logout", authController.processLogOut.bind(authController));

router.post(
  "/auth/refresh",
  authController.renewAccessToken.bind(authController),
);

router.get("/google", authController.googleAuth.bind(authController));
router.get(
  "/google/callback",
  authController.googleAuthCallback.bind(authController),
);

export default router;
