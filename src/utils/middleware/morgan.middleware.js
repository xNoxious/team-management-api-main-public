const morgan = require('morgan');
const logger = require('../logger');

/*
Override the stream method by telling
Morgan to use our custom logger instead of the console.log
*/
const stream = {
    // Use the http severity
    write: (message) => logger.http(message),
};

/*
We've told Winston to skip logging HTTP requests if not in dev 
but keep this in case we want to integrate with another logging package.
*/
const skip = () => {
    const env = process.env.NODE_ENV || 'dev';
    return env !== 'dev';
};

const morganMiddleware = morgan(
    /*
     Define message format string. The message format is made from tokens,
     and each token is defined inside the Morgan library.
     We can create our custom token to show what we want from a request.
    */

    ":method :url :status :res[content-length] - :response-time ms",
    { stream, skip }
);

module.exports = morganMiddleware;