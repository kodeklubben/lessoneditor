const {format} = require("util");

const gcsUrl = (filename, bucket?) => {
    const bucketName = bucket || process.env.BUCKET;
    return format(`https://storage.googleapis.com/${bucketName}/${filename}`);
};

export default gcsUrl;
