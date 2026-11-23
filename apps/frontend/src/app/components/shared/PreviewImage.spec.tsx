import { render, screen } from "@testing-library/react";
import PreviewImage, { isPreviewImage } from "./PreviewImage";

describe("lesson thumbnail", () => {
  it("shows a neutral picture, not a broken image, while a lesson has no thumbnail", () => {
    const { container } = render(<PreviewImage />);
    expect(screen.getByTestId("no-preview")).toBeTruthy();
    expect(container.querySelector("img")).toBeNull();
  });

  it("shows the thumbnail when there is one", () => {
    const { container } = render(<PreviewImage src="blob:thumbnail" />);
    expect(container.querySelector("img")?.getAttribute("src")).toBe("blob:thumbnail");
  });

  it("treats the one-byte placeholder a lesson starts with as no thumbnail", () => {
    expect(isPreviewImage("IA==")).toBe(false);
    expect(isPreviewImage(undefined)).toBe(false);
    expect(isPreviewImage("iVBORw0KGgo" + "A".repeat(200))).toBe(true);
  });
});
