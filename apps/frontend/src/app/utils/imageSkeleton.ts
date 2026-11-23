import { createObjectURL } from "blob-util";

/**
 * Stand-ins for a lesson image while it loads, or when it could not be loaded. Same grey surface,
 * corner radius and picture glyph as the thumbnail placeholder (PreviewImage), so a page that is
 * still filling in reads as one thing. They are SVG images, not elements, because the preview
 * is rendered from markdown: the image's own <img> shows them, keeps its alt text, and is
 * swapped for the real picture without the text around it moving more than once.
 */
const SURFACE = "#f3f4f5";
const GLYPH = "#a3a8ad";
const TEXT = "#6b6f73"; // 4.7:1 on the surface

const picture = (broken: boolean) =>
  `<g fill="none" stroke="${GLYPH}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="272" y="118" width="96" height="72" rx="10"/>
    <circle cx="300" cy="142" r="8"/>
    <polyline points="276,184 310,156 330,172 344,162 364,180"/>
    ${broken ? '<line x1="262" y1="204" x2="378" y2="104"/>' : ""}
  </g>`;

const svg = (label: string, pulse: boolean) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="400" height="225">
  <style>
    .pulse { animation: pulse 1.6s ease-in-out infinite; }
    @keyframes pulse { 50% { opacity: 0.55; } }
    @media (prefers-reduced-motion: reduce) { .pulse { animation: none; } }
  </style>
  <g class="${pulse ? "pulse" : ""}">
    <rect width="640" height="360" rx="10" fill="${SURFACE}"/>
    ${picture(!pulse)}
    <text x="320" y="246" text-anchor="middle" fill="${TEXT}"
      font-family="Lato, 'Helvetica Neue', Arial, sans-serif" font-size="22">${label}</text>
  </g>
</svg>`;

const urls: Record<string, string> = {};
const url = (key: string, make: () => string) =>
  (urls[key] ??= createObjectURL(new Blob([make()], { type: "image/svg+xml" })));

/** Shown in place of an image that is still on its way. */
export const loadingImageUrl = () => url("loading", () => svg("Laster bilde …", true));

/** Shown in place of an image the server did not deliver. */
export const failedImageUrl = () => url("failed", () => svg("Kunne ikke laste bildet", false));
