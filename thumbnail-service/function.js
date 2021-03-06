const shoot = require("./shoot");
const initTime = new Date().toISOString();
/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.thumbnailService = async (req, res) => {
  const { url, token } = req.query;
  if (url && token) {
    try {
      console.log("Waiting for", url);
      const buffer = await shoot(url, token);
      res.writeHead(200, {
        "Content-Type": "image/png",
      });
      console.log("Completed", url);
      res.end(buffer);
    } catch (e) {
      console.log("Error", e.message);
      res.status(500).send(e.message);
    }
  } else {
    res
      .status(400)
      .send("Url and token need to be set. Function created: " + initTime);
  }
};
