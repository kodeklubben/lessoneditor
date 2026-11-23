import { Module } from "@nestjs/common";
import { GithubModule } from "../github/github.module";
import { CatalogController } from "./catalog.controller";
import { CatalogService } from "./catalog.service";

@Module({
  imports: [GithubModule],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
