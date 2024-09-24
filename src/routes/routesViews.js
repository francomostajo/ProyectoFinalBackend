import express from 'express';
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';
import UserModel from '../dao/models/user.model.js';
import ProductModel from '../dao/models/product.model.js';
import CartModel from '../dao/models/cart.model.js';

const router = express.Router();

// Ruta para la página principal
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).lean();
        res.render('home', { user });
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
});

// Ruta para la lista de productos
router.get('/products', isAuthenticated, async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let sort = req.query.sort || 'asc';
    let category = req.query.category || '';
    let availability = req.query.availability || '';

    let filter = {};
    if (category) filter.category = category;
    if (availability) filter.status = availability;

    try {
        let result = await ProductModel.paginate(filter, {
            page,
            limit: 5,
            lean: true,
            sort: { price: sort === 'asc' ? 1 : -1 }
        });

        result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages);
        const user = await UserModel.findById(req.user._id).lean();
        res.render('products', { docs: result.docs, user });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
});

// Ruta para el chat
router.get('/chat', isAuthenticated, (req, res) => {
    res.render('chat');
});

// Ruta para el registro de usuario
router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

// Ruta para el inicio de sesión
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

// Ruta para la vista del carrito
router.get('/cart/:cid', isAuthenticated, async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await CartModel.findById(cid).populate('products.productId').lean();
        const user = await UserModel.findById(req.user._id).lean();
        if (!cart) {
            return res.status(404).render('error', { message: 'Carrito no encontrado' });
        }
        let totalAmount = 0;
        cart.products.forEach(product => {
            totalAmount += product.productId.price * product.quantity;
        });
        res.render('cart', { cart, user, totalAmount });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito' });
    }
});
// Nueva ruta para la solicitud de restablecimiento de contraseña
router.get('/request-password-reset', isNotAuthenticated, (req, res) => {
    res.render('request-password-reset');
});

// Nueva ruta para el formulario de restablecimiento de contraseña
router.get('/reset-password/:token', isNotAuthenticated, async (req, res) => {
    const { token } = req.params;

    // Aquí deberías agregar la lógica para verificar el token
    // Si el token es válido, renderiza la vista de restablecimiento de contraseña
    // Si el token no es válido, muestra un mensaje de error o redirige

    try {
        const user = await UserModel.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }).lean();

        if (!user) {
            return res.status(400).render('error', { message: 'El enlace de restablecimiento de contraseña es inválido o ha expirado.' });
        }

        res.render('reset-password', { token });
    } catch (error) {
        console.error('Error al verificar el token de restablecimiento de contraseña:', error);
        res.status(500).json({ message: 'Error al verificar el token de restablecimiento de contraseña' });
    }
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

export default router;