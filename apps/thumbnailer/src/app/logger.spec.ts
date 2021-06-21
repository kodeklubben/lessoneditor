import logger from "./logger";

it("should logg nice json", async () => {
    logger.log("hello", {
        compontent: "somefunction"
    })
});
