import express from 'express';
import { generateMockProducts } from '../utils/mocking.js';

const router = express.Router();

router.get('/mockingproducts', (req, res) => {
    const products = generateMockProducts();
    res.json(products);
});

export default router;