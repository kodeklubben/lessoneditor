const {Storage} = require("@google-cloud/storage");
const storage = new Storage();
const loadFileGcsToString = async (filename, bucketName?) => {
    const bucket = storage.bucket(bucketName || process.env.BUCKET);
    const data = await bucket.file(filename).download();
    return data[0].toString();
};

export default loadFileGcsToString
