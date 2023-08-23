import { Module } from "@nestjs/common";
import { ThumbService } from "./thumb.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [ThumbService],
  exports: [ThumbService],
})
export class ThumbModule {}
