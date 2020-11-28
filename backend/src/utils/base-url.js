/**
 *
 * @param {!express:Request} req HTTP request context.
 */
module.exports = (req) => {
  const protocol = req.hostname === "localhost" ? "http" : "https";
  return protocol + "://" + req.get("host");
};
