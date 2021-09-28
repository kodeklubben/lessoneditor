import { Module, forwardRef } from "@nestjs/common";
import { ThumbService } from "./thumb.service";
import {TypeOrmModule} from "@nestjs/typeorm"
import { HttpModule } from "@nestjs/common";
import { AuthModule } from "../../../auth/src/lib/auth.module";


@Module({
  imports:[HttpModule],
  providers: [ThumbService],
  exports: [ThumbService],
})
export class ThumbModule {}
