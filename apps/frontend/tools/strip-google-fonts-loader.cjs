/**
 * semantic-ui-css starts with @import url(https://fonts.googleapis.com/...), which made every
 * visitor's browser contact Google. Lato is bundled from @fontsource/lato instead (styles.scss).
 */
module.exports = function stripGoogleFonts(source) {
  return source.replace(/@import\s+url\(\s*['"]?https:\/\/fonts\.googleapis\.com[^)]*\)\s*;?/g, "");
};
