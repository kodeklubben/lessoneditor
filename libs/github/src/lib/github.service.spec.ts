import { Test } from "@nestjs/testing";
import { GithubService } from "./github.service";

describe("GithubService", () => {
  let service: GithubService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [GithubService],
    }).compile();

    service = module.get(GithubService);
  });

  it("should be defined", () => {
    expect(service).toBeTruthy();
  });
});
