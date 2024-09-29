import express from 'express';
import {
    getProducts,
    getCategories,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';
import { isAdmin, isAuthenticated, isAdminOrPremium } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:pid', getProductById);
router.post('/add', isAuthenticated, isAdminOrPremium, createProduct);
router.put('/:pid', isAuthenticated, isAdminOrPremium, updateProduct);
router.delete('/:pid', isAuthenticated, isAdminOrPremium, deleteProduct);

export default router;