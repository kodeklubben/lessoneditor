const {Storage} = require("@google-cloud/storage");
const storage = new Storage();
const loadFromGcs = (filename, bucketName?) => {
    const bucket = storage.bucket(bucketName || process.env.BUCKET);
    return bucket.file(filename).createReadStream();
}

export default loadFromGcs
