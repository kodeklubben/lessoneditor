import React from "react";
import moxios from "moxios";
import paths from "../paths.json";
import { UserContext, UserContextProvider } from "./UserContext";
import TestRenderer from "react-test-renderer";

describe("UserContext", function () {
  beforeEach(function () {
    // import and pass your custom axios instance to this method
    moxios.install();
  });

  moxios.stubRequest(paths.USER, {
    status: 200,
    responseText: {
      name: "TestName",
    },
  });
  const testLesson = {
    course: "microbit",
    lesson: "one-thing",
    title: "Hello One Thing",
  };

  moxios.stubRequest(paths.USER_LESSONS, {
    status: 200,
    responseText: [
      testLesson,
      {
        course: "macrobit",
        lesson: "another-thing",
        title: "Hello Another Thing",
      },
    ],
  });

  afterEach(function () {
    moxios.uninstall();
  });
  it("should mount", async () => {
    const { act } = TestRenderer;
    let testRenderer;
    let contextValue;
    await act(async () => {
      testRenderer = await TestRenderer.create(
        <UserContextProvider>
          <UserContext.Consumer>
            {(value) => {
              contextValue = value;
            }}
          </UserContext.Consumer>
        </UserContextProvider>
      );
    });
    expect(contextValue.user.name).toBe("TestName");
    expect(contextValue.getLesson(testLesson.course, testLesson.lesson)).toBe(
      testLesson
    );
    expect(contextValue.user.lessons.length).toBe(2);
    await act(async () => {
      contextValue.addLesson("nanobit", "third-thing", "Hello Third Thing");
    });
    expect(contextValue.user.lessons.length).toBe(3);
    moxios.wait(function () {
      let request = moxios.requests.mostRecent();
      request
        .respondWith({ status: 200, response: [] })
        .then((d) => console.log([]));
    });
    await act(async () => {
      contextValue.removeLesson(testLesson.course, testLesson.lesson);
    });
    expect(contextValue.user.lessons.length).toBe(2);
    expect(contextValue.getLesson(testLesson.course, testLesson.lesson)).toBe(
      undefined
    );
  });
});
