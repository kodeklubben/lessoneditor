import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ItemList, { ItemListProps } from "./ItemList";

describe("ItemList component", () => {
  it("renders courseTitle without crashing", () => {
    const fakeItem: ItemListProps["items"] = [
      {
        course: "python",
        courseTitle: "Python",
        lesson: "test",
        lessonId: "abc123",
        lessonTitle: "Test",
        thumb: "/test/test.png",
      },
    ];

    const { getByText } = render(
      <ItemList
        items={fakeItem}
        removeLesson={async () => {
          await "lesson removed";
        }}
        navigateToHome={() => {
          "navigateToHome";
        }}
      ></ItemList>
    );
    expect(getByText("Python")).toBeInTheDocument();
  });
});
