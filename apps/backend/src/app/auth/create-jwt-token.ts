const jwt = require("jsonwebtoken");

const createJwtToken = (username, secret) => {
    return jwt.sign({sub: username}, secret);
};

export default createJwtToken;
