const fs = require("fs");
const saveToDisk = require("./save-to-disk");
const getTempDir = require("./get-temp-dir");

it("should save file to disk", async () => {
  const filename = getTempDir(["just", "for", "test", "testfile.txt"]);
  const testContent = "abc";
  await saveToDisk(filename, Buffer.from(testContent));
  const res = fs.readFileSync(filename, "utf-8");
  expect(res).toBe(testContent);
  fs.unlinkSync(filename);
});
