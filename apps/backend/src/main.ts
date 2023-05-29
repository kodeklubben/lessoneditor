import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as bodyParser from "body-parser";
import { AppModule } from "./app/app.module";
import * as ExpressSession from "express-session";
import { SessionEntity } from "./session/session.entity";
import { Connection } from "typeorm";
import { TypeormStore } from "connect-typeorm";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn"],
  });
  const sessionRepsitory = app.get(Connection).getRepository(SessionEntity);
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
  const port = process.env.PORT || 8400;
  await app.listen(port, () => {
    Logger.log("Listening at http://localhost:" + port + "/" + globalPrefix + "/user");
  });
}

bootstrap().then();
