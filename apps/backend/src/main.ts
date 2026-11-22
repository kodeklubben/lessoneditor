import "dotenv/config";
import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app/app.module";
import { DataSource } from "typeorm";
import ExpressSession from "express-session";
import { PostgresSessionStore } from "./session/postgres-session.store";
import { Session } from "./session/session.entity";
import passport from "passport";
import cookieParser from "cookie-parser";
import { originCheck } from "./app/origin-check";

async function bootstrap() {
  for (const key of [
    "GH_CLIENT_ID",
    "GH_CLIENT_SECRET",
    "GH_CALLBACK_URL",
    "FRONTEND_URL",
    "THUMB_SERVICE_URL",
    "COOKIE_SECRET",
    "SESSION_SECRET",
    "JWT_SECRET",
  ]) {
    if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
  }
  if (process.env.JWT_SECRET === process.env.GH_CLIENT_SECRET)
    throw new Error("JWT_SECRET must not reuse GH_CLIENT_SECRET");
  const production = process.env.NODE_ENV === "production";
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  if (production) app.set("trust proxy", 1);
  app.use("/api", originCheck(process.env.FRONTEND_URL));
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(
    ExpressSession({
      resave: false,
      saveUninitialized: false,
      store: new PostgresSessionStore(app.get(DataSource).getRepository(Session)),
      secret: process.env.SESSION_SECRET,
      cookie: { httpOnly: true, sameSite: "lax", secure: production, maxAge: 86400000 },
    }),
  );
  // Images are sent as base64 JSON: 5 MB (the editor's limit) is about 6.7 MB encoded.
  app.useBodyParser("json", { limit: "8mb" });
  app.use(passport.initialize());
  app.use(passport.session());
  // Request bodies typed as classes (app/request-bodies.ts) are checked, and unknown fields dropped.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix("api");
  app.enableShutdownHooks();
  const port = Number(process.env.PORT || 8080);
  const host = process.env.HOST || (production ? "0.0.0.0" : "localhost");
  await app.listen(port, host);
  Logger.log(`Listening at http://${host}:${port}/api`);
}

bootstrap().catch((error) => {
  Logger.error(error.message);
  process.exitCode = 1;
});
