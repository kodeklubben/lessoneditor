const { Datastore } = require("@google-cloud/datastore");
const { DatastoreStore } = require("@google-cloud/connect-datastore");
const isAppEngine = require("../utils/isAppEngine");
const { MemoryStore } = require("express-session").MemoryStore;
module.exports = () => {
  if (isAppEngine()) {
    return new DatastoreStore({
      kind: "lessoneditor-sessions",
      dataset: new Datastore({}),
    });
  } else {
    return MemoryStore;
  }
};
