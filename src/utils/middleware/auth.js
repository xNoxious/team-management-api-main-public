const jwt = require("jsonwebtoken");
const logger = require('../logger');
const config = process.env;

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token || token === undefined) {
        logger.error('Missing authorization token!');
        return res.status(403).send("A token is required for authentication! You can generate it from Postman's authentication folder which requires you to register and then authorize yourself to get a token.");
    }
    try {
        jwt.verify(token, config.JWT_SECRET_KEY);
    } catch (err) {
        logger.error('Invalid authorization token!');
        return res.status(401).send("Invalid Token!");
    }
    return next();
};

module.exports = verifyToken;