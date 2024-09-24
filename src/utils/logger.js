import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
};

const levelColors = {
    debug: 'white',
    http: 'green',
    info: 'blue',
    warning: 'yellow',
    error: 'red',
    fatal: 'magenta',
};

winston.addColors(levelColors);

const commonFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
);

const developmentLogger = winston.createLogger({
    levels,
    format: winston.format.combine(
        winston.format.colorize({ all: true }),
        commonFormat
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug',
        }),
    ],
});

const productionLogger = winston.createLogger({
    levels,
    format: winston.format.combine(
        winston.format.colorize({ all: true }), // Agregar colorize para consola en producción
        commonFormat
    ),
    transports: [
        new winston.transports.Console({
            level: 'info',
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error',
            format: commonFormat // Sin color para el archivo de errores
        }),
    ],
});

const logger = process.env.LOGGER_ENV === 'production' ? productionLogger : developmentLogger;

export default logger;