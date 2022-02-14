import { Module, forwardRef } from "@nestjs/common";
import { ThumbService } from "./thumb.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpModule } from "@nestjs/axios";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [HttpModule],
  providers: [ThumbService],
  exports: [ThumbService],
})
export class ThumbModule {}
