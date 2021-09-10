import { Test } from "@nestjs/testing";
import { LessonController } from "./lesson.controller";
import { LessonService } from "./lesson.service";

describe("LessonController", () => {
  let controller: LessonController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LessonService],
      controllers: [LessonController],
    }).compile();

    controller = module.get(LessonController);
  });

  it("should be defined", () => {
    expect(controller).toBeTruthy();
  });
});
