import takeScreenshot, {killBrowser} from "./take-screenshot";
import * as fs from "fs";


it.skip("should take a screenshot of a service", async () => {
    // @todo should really create our own test-server to avoid external dependency like this
    const resultBuffer = await takeScreenshot("https://example.com", "random-token");
    //fs.writeFileSync("./test.png", resultBuffer)
    expect(resultBuffer.length).toBeGreaterThan(20000);
    await killBrowser();
});
