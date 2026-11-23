import { act, renderHook } from "@testing-library/react";

const mockPut = jest.fn();
jest.mock("axios", () => ({ put: (...args: unknown[]) => mockPut(...args) }));
const mockAnnounce = jest.fn();
jest.mock("./thumbnailEvents", () => ({
  announceThumbnail: (...args: unknown[]) => mockAnnounce(...args),
}));
const { useThumbnailBackfill } = require("./useThumbnailBackfill");

const lesson = (lessonId: number, updated_at: string) => ({ lessonId, updated_at }) as never;
const lessons = [
  lesson(1, "2026-01-01"),
  lesson(2, "2026-05-01"),
  lesson(3, "2026-03-01"),
  lesson(4, "2026-04-01"),
  lesson(5, "2026-02-01"),
];
const lessonIds = () => mockPut.mock.calls.map(([url]) => Number(/lesson\/(\d+)/.exec(url)![1]));

describe("pictures for cards without one, in the background", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    localStorage.clear();
    mockPut.mockReset();
    mockAnnounce.mockReset();
  });
  afterEach(() => jest.useRealTimers());

  const settle = async () => {
    await act(async () => {
      jest.advanceTimersByTime(4000);
    });
    // Let the queue's awaits run.
    for (let i = 0; i < 10; i++) await act(async () => undefined);
  };

  it("asks for three, newest first, one at a time, when the page has settled", async () => {
    let inFlight = 0;
    let most = 0;
    mockPut.mockImplementation(async () => {
      most = Math.max(most, ++inFlight);
      await Promise.resolve();
      inFlight--;
      return { data: { text: "tekst" } };
    });
    renderHook(() => useThumbnailBackfill([1, 2, 3, 4, 5], lessons));
    expect(mockPut).not.toHaveBeenCalled();
    await settle();
    expect(lessonIds()).toEqual([2, 4, 3]);
    expect(most).toBe(1);
    expect(mockAnnounce).toHaveBeenCalledTimes(3);
  });

  it("leaves a lesson that failed alone for a day", async () => {
    mockPut.mockRejectedValueOnce(new Error("502")).mockResolvedValue({ data: { text: null } });
    const first = renderHook(() => useThumbnailBackfill([2], lessons));
    await settle();
    first.unmount();
    mockPut.mockClear();
    renderHook(() => useThumbnailBackfill([2, 4], lessons));
    await settle();
    expect(lessonIds()).toEqual([4]);
  });

  it("does nothing while no card is missing a picture", async () => {
    renderHook(() => useThumbnailBackfill([], lessons));
    await settle();
    expect(mockPut).not.toHaveBeenCalled();
  });
});
