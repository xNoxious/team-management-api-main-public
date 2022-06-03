const winston = require('winston');

/*
Define the severity levels. With them we can create log files and
show/hide levels based on the running environment.
*/
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
}

/*
Set the severity based on the current NODE_ENV: show all log levels 
if in development mode, otherwise - only warn and error messages.
*/
const level = () => {
    const env = process.env.NODE_ENV || 'dev'
    const isDevelopment = env === 'dev'
    return isDevelopment ? 'debug' : 'warn'
}

// Define colors for log message types
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
}

winston.addColors(colors)

// Format the log messages.
const format = winston.format.combine(
    winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
)

// Define which transports the logger must use to print out messages. 
// In this example, we are using three different transports 
const transports = [
    // Allow the use the console to print the messages
    new winston.transports.Console(),
    // Allow to print all the error level messages inside an error.log file
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    // Export successful/unsucessful logs to a file
    new winston.transports.File({ filename: 'logs/all.log' })
]

// Create the logger 
const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports
})

module.exports = Logger