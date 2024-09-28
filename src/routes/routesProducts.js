import express from 'express';
import {
    getProducts,
    getCategories,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { isAdmin, isAuthenticated, isPremium } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:pid', getProductById);
router.post('/products', isAuthenticated, isAdmin, isPremium, createProduct);
router.put('/:pid', isAuthenticated, isAdmin, isPremium, updateProduct);
router.delete('/:pid', isAuthenticated, isAdmin, isPremium, deleteProduct);

export default router;