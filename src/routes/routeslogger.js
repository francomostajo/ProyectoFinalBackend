import { Router } from 'express';
import logger from '../utils/logger.js';

const router = Router();

router.get('/test', (req, res) => {
    logger.debug('This is a debug message');
    logger.http('This is an http message');
    logger.info('This is an info message');
    logger.warning('This is a warning message');
    logger.error('This is an error message');
    logger.fatal('This is a fatal message');

    // Generar un error intencional
    try {
        throw new Error('Test error');
    } catch (err) {
        logger.error('This is a caught error', err);
    }

    res.send('Logger test completed');
});


export default router;