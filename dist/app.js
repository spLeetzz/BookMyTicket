import { validateEnv } from "./config/env.config.js";
import app from "./server.js";
import { createServer } from "node:http";
console.log(process.env);
console.log("JWT auth backend for seat booking. Access/refresh token rotation with Google OAuth support. PostgreSQL transaction uses `SELECT FOR UPDATE` to prevent double booking races. REST APIs for auth, seats, health. Drizzle migrations, seeded data, strict env validation, Node + Express architecture.");
validateEnv(); // load env + validate they exist, must be at top
const server = createServer(app);
server.listen(process.env.PORT ?? 3000, () => {
    console.log("Server listening on PORT " + (process.env.PORT ?? 3000));
});
