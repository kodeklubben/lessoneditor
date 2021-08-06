import {resolveUrlTemplate} from "./resolve-url-template";

it("should resolve url template", () => {
    const resolved = resolveUrlTemplate("/:first/:second", {
        first: "hello",
        second: "world",
    });
    expect(resolved).toBe("/hello/world");
});
