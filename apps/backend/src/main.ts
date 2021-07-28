import * as dotenv from "dotenv";
import * as express from 'express';
import setupServer from './app/setupServer'
import isAppEngine from "./app/utils/isAppEngine";
import getTempDir from "./app/utils/get-temp-dir";
import {join} from 'path';

if (isAppEngine()) {
    dotenv.config({path: join(process.cwd(), ".env")});
}

const app = express();


console.log("GITHUB_CLIENT_ID", process.env.GITHUB_CLIENT_ID);
console.log("GITHUB_CALLBACK_URL", process.env.GITHUB_CALLBACK_URL);
setupServer(app);
const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/api');
    if (!isAppEngine()) {
        console.log("Using temp dir:", getTempDir([]));
    }
});
server.on('error', console.error);
