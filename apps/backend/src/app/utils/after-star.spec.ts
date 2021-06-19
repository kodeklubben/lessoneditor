import afterStar from "./after-star";

it("should return what is after the star", () => {
    const res = afterStar("/somew/*", "/somew/withsomeurl/file.md");
    expect(res).toBe("withsomeurl/file.md");
});
