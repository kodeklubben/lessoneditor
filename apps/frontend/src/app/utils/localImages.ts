const IMAGE = /(!\[[^\]]*\]\()\s*(?:\.\/)?([^)\s]+)((?:\s+"[^"]*")?\s*\))/g;

/**
 * Swaps the lesson's own images (./bilde.png) for the blob URLs the editor has loaded. Each link
 * is matched by its own name; external images and unknown files are left as they are (K17).
 */
export function replaceLocalImageUrls(
  markdown: string,
  images: Record<string, string>,
  upstreamBase?: string,
): string {
  return markdown.replace(IMAGE, (whole, prefix: string, path: string, suffix: string) => {
    // A shared image of the course (../bilder/x.png) is not copied with a lesson from the repo;
    // the preview shows it from the commit the copy was made from.
    if (upstreamBase && path.startsWith("../"))
      return prefix + new URL(path, upstreamBase).href + suffix;
    if (path.includes("/") || path.includes(":")) return whole;
    const url = images[path];
    return url ? prefix + url + suffix : whole;
  });
}

/** Where the files of a copied lesson's folder are on GitHub, or undefined for the editor's own lessons. */
export function upstreamImageBase(lesson?: {
  upstream_path?: string | null;
  upstream_commit?: string | null;
}): string | undefined {
  if (!lesson?.upstream_path || !lesson.upstream_commit) return undefined;
  return `https://raw.githubusercontent.com/kodeklubben/oppgaver/${lesson.upstream_commit}/${lesson.upstream_path}/`;
}
