import { Elysia } from "elysia";
import { logger } from "./lib/logger";

const app = new Elysia()
  .get("/ip", ({ request }) => {
    const ip = request.headers.get("x-forwarded-for");
    if (ip) logger.info({ ip });
    return { ip };
  })
  .listen(4000);

console.log(`🦊 Elysia is running at port ${app.server?.port}!`);
