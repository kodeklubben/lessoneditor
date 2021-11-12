import { GithubService } from "./github.service";
import { CacheModule, Module } from "@nestjs/common";

@Module({
  imports: [CacheModule.register()],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
