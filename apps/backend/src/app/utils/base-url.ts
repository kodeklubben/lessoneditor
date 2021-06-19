/**
 *
 * @param {!express:Request} req HTTP request context.
 */
const baseUrl = (req) => {
    const protocol = req.hostname === "localhost" ? "http" : "https";
    return protocol + "://" + req.get("host");
};

export default baseUrl
