// The alt text may hold one level of brackets, such as a link to the image's source
// (uten_datamaskin/Algoritmia: ![[Robot historic …](https://…)](./bilde.jpg)).
const IMAGE = /(!\[(?:[^[\]]|\[[^\]]*\])*\]\()\s*(?:\.\/)?([^)\s]+)((?:\s+"[^"]*")?\s*\))/g;

/**
 * Runs `replace` on the markdown outside fenced code blocks (``` … ```): an image link written in
 * a code example is text to show, not an image to load (M4).
 */
function outsideCodeBlocks(markdown: string, replace: (text: string) => string): string {
  const parts = markdown.split(/(^```[^\n]*\n[\s\S]*?^```[^\n]*$)/m);
  return parts.map((part, index) => (index % 2 === 1 ? part : replace(part))).join("");
}

/**
 * Swaps the lesson's own images (./bilde.png) for the blob URLs the editor has loaded. Each link
 * is matched by its own name; external images and unknown files are left as they are (K17).
 *
 * A copy of a published lesson holds only the images it could copy. The rest (../bilder/,
 * subfolders, SVG, names with dots such as Ada_Lovelace.600x751.jpg) are shown from the commit
 * the copy was made from, as on oppgaver.kidsakoder.no.
 */
export function replaceLocalImageUrls(
  markdown: string,
  images: Record<string, string>,
  upstreamBase?: string,
): string {
  return outsideCodeBlocks(markdown, (text) =>
    text.replace(IMAGE, (whole, prefix: string, path: string, suffix: string) => {
      if (path.includes(":") || path.startsWith("/")) return whole;
      const url = path.includes("/") ? undefined : images[path];
      if (url) return prefix + url + suffix;
      if (upstreamBase) return prefix + new URL(path, upstreamBase).href + suffix;
      return whole;
    }),
  );
}

/** Where the files of a copied lesson's folder are on GitHub, or undefined for the editor's own lessons. */
export function upstreamImageBase(lesson?: {
  upstream_path?: string | null;
  upstream_commit?: string | null;
}): string | undefined {
  if (!lesson?.upstream_path || !lesson.upstream_commit) return undefined;
  return `https://raw.githubusercontent.com/kodeklubben/oppgaver/${lesson.upstream_commit}/${lesson.upstream_path}/`;
}
