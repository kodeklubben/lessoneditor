import {verify} from "jsonwebtoken";


const verifyJwtToken = (token) => {
    try {
        const decoded = verify(token, process.env.GITHUB_CLIENT_SECRET);
        return {
            valid: true,
            data: decoded,
        };
    } catch (err) {
        return {
            valid: false,
            error: err.message,
        };
    }
}

export default verifyJwtToken
