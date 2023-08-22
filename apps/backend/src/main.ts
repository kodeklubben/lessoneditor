/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as bodyParser from "body-parser";
import { AppModule } from "./app/app.module";
import { DataSource } from "typeorm";
import * as ExpressSession from "express-session";
import { Session } from "./session/session.entity";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";

console.log("process.env.GITHUB_CLIENT_ID", process?.env?.GITHUB_CLIENT_ID);

async function bootstrap() {
  Logger.log("process.env.GITHUB_CLIENT_SECRET", process?.env?.GITHUB_CLIENT_SECRET);
  Logger.log("process.env.POSTRES_PASSWORD", process?.env?.POSTGRES_PASSWORD);
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  const sessionRepository = app.get(DataSource).getRepository(Session);

  app.use(
    ExpressSession({
      resave: false,
      saveUninitialized: false,
      // store: new TypeormStore({
      //   cleanupLimit: 2,
      //   limitSubquery: false,
      //   ttl: 86400, // 24 hours
      // }).connect(sessionRepository),
      secret: process.env.SESSION_SECRET || "keyboard cat", // Make sure to use a strong secret
    })
  );
  app.enableCors({ origin: true, methods: "GET,HEAD,PUT,PATCH,POST,DELETE", credentials: true });
  app.use(bodyParser.json({ limit: "50mb" }));

  app.use(passport.initialize());
  app.use(passport.session());

  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 8080;

  await app.listen(port, () => {
    Logger.log("Listening at http://localhost:" + port + "/" + globalPrefix);
  });
}

bootstrap();
