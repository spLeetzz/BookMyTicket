import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();
const envSchema = z.object({
    JWT_ACCESS_SECRET: z.string().min(10),
    JWT_ACCESS_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/), // is number ending with [s,m,h,d]
    JWT_REFRESH_SECRET: z.string().min(10),
    JWT_REFRESH_EXPIRES_IN: z.string().regex(/^\d{1,2}d$/), // is 2 digit number ending with 'd'
    DATABASE_URL: z.url(),
    PORT: z.coerce.number().default(3000),
});
export function validateEnv() {
    return envSchema.parse(process.env);
}
