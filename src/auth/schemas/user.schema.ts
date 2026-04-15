import { z } from "zod";

export const SignUpPayloadSchema = z
  .object({
    firstName: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "First name is required"
            : "Invalid first name",
      })
      .trim()
      .min(2, { message: "First name too short" })
      .max(90),
    lastName: z.string().trim().max(90).nullable().optional(),
    email: z
      .email({
        error: (issue) =>
          issue.input === undefined ? "Email is required" : "Invalid email",
      })
      .trim()
      .max(255)
      .toLowerCase(),
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Invalid password",
      })
      .min(8, { message: "Password too short" })
      .max(32, { message: "Password too long" })
      .regex(/^\S+$/, { message: "Password cannot contain spaces" }),
  })
  .strict();

export const SignInPayloadSchema = z
  .object({
    email: z
      .email({
        error: (issue) =>
          issue.input === undefined ? "Email is required" : "Invalid email",
      })
      .trim()
      .max(255)
      .toLowerCase(),
    password: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Password is required"
            : "Invalid password",
      })
      .min(8, { message: "Password too short" })
      .max(32, { message: "Password too long" }).nullable().optional(),
  })
  .strict();