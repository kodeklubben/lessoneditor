import isAppEngine from "../utils/isAppEngine";
import {DatastoreStore} from "@google-cloud/connect-datastore";
import {Datastore} from "@google-cloud/datastore"
import {MemoryStore} from "express-session";

const sessionStorage = () => {
    if (isAppEngine()) {
        return new DatastoreStore({
            kind: "lessoneditor-sessions",
            dataset: new Datastore({}),
        });
    } else {
        return new MemoryStore;
    }
}

export default sessionStorage
