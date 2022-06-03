const logger = require('../utils/logger');

/*
    This is a very simple implementation of how I'd add authentication.
    I would go to the database here, fetch the hash for the given email
    and return it. This is just for demonstration so I haven't added a
    database, but it can be done very easily in this model.
*/
const imaginaryDB = new Map();

function registerUser(name, email, hash) {
    let user = imaginaryDB.get(email);

    if (!user) {
        imaginaryDB.set(email, {
            name,
            email,
            hash
        })
    } else {
        logger.warn('User already exists');
        return user;
    }
}

function getAuthenticationData(email) {
    let user = imaginaryDB.get(email);

    if (!user) {
        logger.warn('User doesn\'t exist');
        return null;
    }

    return user.hash;
}

module.exports = {
    registerUser,
    getAuthenticationData
}