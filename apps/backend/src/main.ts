import "dotenv/config";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app/app.module";
import { DataSource } from "typeorm";
import * as ExpressSession from "express-session";
import { PostgresSessionStore } from "./session/postgres-session.store";
import { Session } from "./session/session.entity";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  for (const key of [
    "GH_CLIENT_ID",
    "GH_CLIENT_SECRET",
    "GH_CALLBACK_URL",
    "FRONTEND_URL",
    "THUMB_SERVICE_URL",
    "COOKIE_SECRET",
    "SESSION_SECRET",
  ]) {
    if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
  }
  const production = process.env.NODE_ENV === "production";
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  if (production) app.set("trust proxy", 1);
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
  app.useBodyParser("json", { limit: "50mb" });
  app.use(passport.initialize());
  app.use(passport.session());
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
