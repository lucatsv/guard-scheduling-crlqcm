const winston = require('winston')

const configureLogging = () => {
    const logConfiguration = {
        transports: [new winston.transports.Console()],
    };
    return winston.createLogger(logConfiguration);
}

const logger = configureLogging();

module.exports = logger
