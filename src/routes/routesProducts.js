import express from 'express';
import {
    getProducts,
    getCategories,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { isAdmin } from '../middleware/auth.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:pid', getProductById);
router.post('/products', isAuthenticated, isAdmin, createProduct);
router.put('/:pid', isAuthenticated, isAdmin, updateProduct);
router.delete('/:pid', isAuthenticated, isAdmin, deleteProduct);

export default router;