import { Module } from "@nestjs/common";
import { ThumbService } from "./thumb.service";
import {TypeOrmModule} from "@nestjs/typeorm"
import { HttpModule } from "@nestjs/common";


@Module({
  providers: [ThumbService],
  exports: [ThumbService],
})
export class ThumbModule {}
