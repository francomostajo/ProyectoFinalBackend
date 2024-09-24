import express from 'express';
import { getCarts, createNewCart, addProduct, addProductToUser, purchaseCart, viewCart } from '../controllers/cart.controller.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/', isAuthenticated, getCarts);
router.post('/', isAuthenticated, createNewCart);
router.post('/:cid/product/:pid', isAuthenticated, addProduct);
router.post('/add', isAuthenticated, addProductToUser);
router.get('/:cid/purchase', isAuthenticated, viewCart);  // Mostrar los productos del carrito y finalizar compra
router.post('/:cid/purchase', isAuthenticated, purchaseCart);

export default router;