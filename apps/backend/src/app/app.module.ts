import { Module, forwardRef } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { LessonModule } from "../lesson/lesson.module";
import { AuthModule } from "../auth/auth.module";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { dataSourceOptions } from "../../../../db/data-sources";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    CacheModule.register({
      isGlobal: true,
      ttl: 0, // do not expire
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../../../../../frontend"),
      exclude: ["/api*"],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    forwardRef(() => UserModule),
    AuthModule,
    UserModule,
    LessonModule,
    PassportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
