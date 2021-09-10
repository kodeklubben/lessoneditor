import { Test } from "@nestjs/testing";
import { LessonService } from "./lesson.service";

describe("LessonService", () => {
  let service: LessonService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [LessonService],
    }).compile();

    service = module.get(LessonService);
  });

  it("should be defined", () => {
    expect(service).toBeTruthy();
  });
});
