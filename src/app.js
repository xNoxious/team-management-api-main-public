/*
    Separate Express.js setup from server to organise code better.
*/
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('./utils/middleware/morgan.middleware');
const helmet = require("helmet");
const teamRouter = require('./routes/team/team.router');
const authenticationRouter = require('./routes/authentication/authentication.router');

const app = express();
dotenv.config();
app.use(morgan);
app.use(helmet());
app.use(express.json());
app.use(teamRouter);
app.use(authenticationRouter);

module.exports = app;