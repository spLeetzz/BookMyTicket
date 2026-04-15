import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema.js";
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL ??
        "postgresql://user:pass@localhost:5432/bookticket",
    max: 20,
    idleTimeoutMillis: 10000,
    // since it's a hackathon project idleTimeout is set 10s to conserve power
    // in real booking systems it should be 0 as requests can rush suddenly
    connectionTimeoutMillis: 0,
    maxLifetimeSeconds: 60,
});
export const db = drizzle(pool, { schema });
