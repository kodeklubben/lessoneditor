const listFiles = require("../backend/lesson/list-files");

const examples = async () => {
  const files = await listFiles(["mijohansen", "microbit", "pxt_gangespill"]);
  console.log(files);
};

examples();
