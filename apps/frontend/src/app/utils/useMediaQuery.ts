import { useEffect, useState } from "react";

/** Follows a CSS media query, so only one of two layouts is rendered (and has hotkeys). */
export function useMediaQuery(query: string, fallback = true): boolean {
  const get = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(query).matches
      : fallback;
  const [matches, setMatches] = useState(get);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);
    onChange();
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/** The breakpoint the editor's SCSS uses for the desktop button panel. */
export const DESKTOP_EDITOR = "(min-width: 920px)";
