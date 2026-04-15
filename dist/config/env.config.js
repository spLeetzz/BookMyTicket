import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
console.log(process.env);
console.log("hi");
const envSchema = z.object({
  JWT_ACCESS_SECRET: z.string().min(10),
  JWT_ACCESS_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/),
  JWT_REFRESH_SECRET: z.string().min(10),
  JWT_REFRESH_EXPIRES_IN: z.string().regex(/^\d{1,2}d$/),
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().default(3000),
  SESSION_SECRET: z.string().min(10),
  FRONTEND_URL: z.url().optional(),
  NODE_ENV: z.enum(["dev", "production", "test"]).default("dev"),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.url(),
});
export function validateEnv() {
  return envSchema.parse(process.env);
}
