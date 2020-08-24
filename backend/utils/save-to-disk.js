const fs = require("fs");
const path = require("path");
module.exports = async (filename, buffer) => {
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  return new Promise((resolve, reject) => {
    fs.open(filename, "w", (err, fd) => {
      if (err) reject(err);
      fs.write(fd, buffer, 0, buffer?.length, null, (err) => {
        if (err) reject(err);
        fs.close(fd, () => {
          resolve("file written");
        });
      });
    });
  });
};
