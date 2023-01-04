/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as bodyParser from "body-parser";
import { AppModule } from "./app/app.module";
import * as Express from "express";
import * as ExpressSession from "express-session";
import { Session } from "./session/session.entity";
import { Connection } from "typeorm";
import { TypeormStore } from "connect-typeorm";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
dotenv.config();

console.log("process.env.GITHUB_CLIENT_ID", process.env.GITHUB_CLIENT_ID);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sessionRepsitory = app.get(Connection).getRepository(Session);
  app.enableCors();

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    ExpressSession({
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({
        cleanupLimit: 2,
        limitSubquery: false,
        ttl: 86400,
      }).connect(sessionRepsitory),
      secret: "keyboard cat",
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 8080;
  await app.listen(port, () => {
    Logger.log("Listening at http://localhost:" + port + "/" + globalPrefix);
  });
}

bootstrap();
