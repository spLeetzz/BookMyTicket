import { validateEnv } from "./config/env.config.js";
import app from "./server.js";
import { createServer } from "node:http";
validateEnv(); // load env + validate they exist, must be at top
const server = createServer(app);
server.listen(process.env.PORT ?? 3000, () => {
    console.log("Server listening on PORT " + (process.env.PORT ?? 3000));
});
