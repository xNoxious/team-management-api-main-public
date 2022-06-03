const express = require('express');
const {
    httpRegister,
    httpAuthenticate,
} = require('./authentication.controller');

const authenticationRouter = express.Router();

// Can serve them with '/authentication' prefix in app.js but I prefer to be explicit with routes. Maybe if they become too many.
authenticationRouter.post('/authentication/register', httpRegister);
authenticationRouter.post('/authentication/authenticate', httpAuthenticate);

module.exports = authenticationRouter;