import errorDictionary from '../utils/errorDictionary.js';
import logger from '../utils/logger.js';

function errorHandler(err, req, res, next) {
    if (err) {
        logger.error('Error: ', err.message); // Usar logger
        logger.error('Stack trace: ', err.stack); // Usar logger

        const errorResponse = errorDictionary[err.message] || {
            code: 9999,
            message: 'Unknown error',
        };

        res.status(500).json({ error: errorResponse });
    } else {
        next();
    }
}

export default errorHandler;