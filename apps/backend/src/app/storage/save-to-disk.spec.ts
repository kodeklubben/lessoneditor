import getTempDir from "../utils/get-temp-dir";
import saveToDisk from "./save-to-disk";

const fs = require("fs");



const testFileName = getTempDir(["just", "for", "test", "testfile.txt"]);

it("should save file to disk", async () => {
    const testContent = "abc";
    await saveToDisk(testFileName, Buffer.from(testContent));
    const res = fs.readFileSync(testFileName, "utf-8");
    expect(res).toBe(testContent);
});
afterAll(() => {
    fs.unlinkSync(testFileName);
});
