import { KeyboardEvent } from "react";

/**
 * Props that make a non-button element (a card image, a Semantic Item) work like a button for
 * keyboard and screen reader users: focusable, announced with a name, Enter/Space activate it.
 */
export function asButton(onActivate: () => void, label: string) {
  return {
    role: "button" as const,
    tabIndex: 0,
    "aria-label": label,
    onClick: onActivate,
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onActivate();
      }
    },
  };
}
