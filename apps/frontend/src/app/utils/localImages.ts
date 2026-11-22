const IMAGE = /(!\[[^\]]*\]\()\s*(?:\.\/)?([^)\s]+)((?:\s+"[^"]*")?\s*\))/g;

/**
 * Swaps the lesson's own images (./bilde.png) for the blob URLs the editor has loaded. Each link
 * is matched by its own name; external images and unknown files are left as they are (K17).
 */
export function replaceLocalImageUrls(markdown: string, images: Record<string, string>): string {
  return markdown.replace(IMAGE, (whole, prefix: string, path: string, suffix: string) => {
    if (path.includes("/") || path.includes(":")) return whole;
    const url = images[path];
    return url ? prefix + url + suffix : whole;
  });
}
