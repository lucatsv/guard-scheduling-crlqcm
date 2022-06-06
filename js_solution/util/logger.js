const configureLogging = () => {
    const winston =require('winston')
    const logConfiguration = {
        'transports': [
            new winston.transports.Console()
        ]
    };
    return winston.createLogger(logConfiguration);
}

const logger = configureLogging();

module.exports = logger