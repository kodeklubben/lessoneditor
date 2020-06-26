module.exports = (app) => {
  app.post("/api/lessons/:lessonId", async (req, res) => {
    const lessonId = req.params.lessonId;
    const filename = [lessonId, "data.json"].join("/");
    await saveToGcs(filename, JSON.stringify(req.body), "lessoneditor");
    res.send("ok");
  });
};
