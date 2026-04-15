import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import ApiError from "../utils/api.errors.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Invalid request payload",
        details: err.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
      },
    });
  }

  return res.status(500).json({
    error: {
      message: "Internal server error",
    },
  });
};
