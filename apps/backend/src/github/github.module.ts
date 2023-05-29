import { GithubService } from "./github.service";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
