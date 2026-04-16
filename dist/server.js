import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./auth/routes/auth.routes.js";
import seatRouter from "./app/routes/seats.routes.js";
import eventRouter from "./app/routes/events.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import ApiError from "./utils/api.errors.js";
import { sessionOptions } from "./config/session.config.js";
import session from "express-session";
import cors from "cors";
const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(session(sessionOptions));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use(authRouter);
app.use("/seats", seatRouter);
app.use("/events", eventRouter);
app.use((req, _res, next) => next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`)));
app.use(errorHandler);
export default app;
