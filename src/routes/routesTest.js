import express from 'express';
import {
    createUser,
    updateUser,
    deleteUser,
    fetchUserById,
    fetchAllUsers
} from '../controllers/user.controller.js';
import { getCarts, createNewCart, addProduct, purchaseCart } from '../controllers/cart.controller.js';
import { createProduct, updateProduct, deleteProduct, getProductById, getProducts } from '../controllers/product.controller.js';

const router = express.Router();

// Rutas de prueba para usuarios
router.post('/register', createUser); // Cambiado a createUser del nuevo controlador
router.put('/users/:uid', updateUser); // Cambiado a updateUser del nuevo controlador
router.delete('/users/:uid', deleteUser); // Cambiado a deleteUser del nuevo controlador
router.get('/users/:id', fetchUserById); // Cambiado a fetchUserById del nuevo controlador
router.get('/users', fetchAllUsers); // Cambiado a fetchAllUsers del nuevo controlador

// Rutas de prueba para carritos

router.get('/carts', getCarts);
router.post('/carts', createNewCart);
router.post('/carts/:cid/product/:pid', addProduct);
router.post('/carts/:cid/purchase', purchaseCart);

// Rutas de prueba para productos
router.get('/products', getProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products/:id', getProductById);

export default router;