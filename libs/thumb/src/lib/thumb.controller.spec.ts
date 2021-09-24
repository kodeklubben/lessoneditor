import { Test } from "@nestjs/testing";
import { ThumbController } from "./thumb.controller";

describe("ThumbController", () => {
  let controller: ThumbController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ThumbController],
    }).compile();

    controller = module.get(ThumbController);
  });

  it("should be defined", () => {
    expect(controller).toBeTruthy();
  });
});
