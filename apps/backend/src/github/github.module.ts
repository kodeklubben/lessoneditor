import { GithubService } from "./github.service";
import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
