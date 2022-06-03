const logger = require('../../utils/logger');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { registerUser, getAuthenticationData } = require('../../models/authentication.model.js');

async function httpRegister(req, res) {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
        // Note: If we are in prod - we don't want to log password to the console, much worse - a file.
        logger.info(`Incorrect registration submission for user ${name} with email: ${email} and password: ${password}`);

        return res.status(400).json('Incorrect form submission.');
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    let user = registerUser(name, email, hash);

    if (user) {
        return res.status(400).json('User is already registered. Reset your password.');
    }

    logger.info(`User ${name} with email: ${email} registered successfully.`);
    return res.status(200).json('Successful registration.');
}

async function httpAuthenticate(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        logger.info(`Attepmted login via ${email} / ${password}`); // debugging purpose, won't log this in prod. 
        return res.status(400).json('Incorrect form submission.');
    }

    let userHashFromDb = getAuthenticationData(email);
    if (!userHashFromDb) {
        logger.info(`Attepmted login ${email} with password: ${password}`); // debugging purpose, won't log this in prod. 
        return res.status(400).json('Username/password combination doesn\'t exist.');
    }

    const matchingPassword = bcrypt.compareSync(password, userHashFromDb);
    if (matchingPassword) {
        // Generate JWT Token
        // Note: I haven't given the tokens expiration time on purpose so you can test, but can easily add 'expiresIn' below.
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            time: Date(),
            userId: 12
        }

        const token = jwt.sign(data, jwtSecretKey);

        return res.status(200).json(token);
    } else {
        logger.info(`Mismatching username/password combination for user with email: ${email} with password: ${password}`)
        res.status(400).json('Mismatching credentials.')
    }
}

module.exports = {
    httpRegister,
    httpAuthenticate
};
