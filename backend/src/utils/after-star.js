module.exports = (starPattern, path) => {
  const len = starPattern.indexOf("*");
  return path.substring(len);
};
