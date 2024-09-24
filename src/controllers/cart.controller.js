import { getAllCarts, createCart, addProductToCart, addProductToUserCart, purchaseCart as purchaseCartService } from '../service/cart.service.js';
import User from '../dao/models/user.model.js';
import createError from 'http-errors';

export const getCarts = async (req, res, next) => {
    try {
        const carts = await getAllCarts();
        res.json(carts);
    } catch (error) {
        next(createError(500, 'CART_FETCH_ERROR'));
    }
};

export const createNewCart = async (req, res, next) => {
    try {
        const cart = await createCart(req.body.products);
        res.status(201).json(cart);
    } catch (error) {
        next(createError(400, 'CART_CREATION_ERROR'));
    }
};

export const addProduct = async (req, res, next) => {
    try {
        const { cid, pid } = req.params;
        const cart = await addProductToCart(cid, pid);
        res.status(200).json({ success: true, cart });
    } catch (error) {
        next(createError(500, 'CART_ADDITION_ERROR'));
    }
};

export const addProductToUser = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id;
        const cart = await addProductToUserCart(userId, productId, quantity);
        res.json({ success: true, cart });
    } catch (error) {
        next(createError(500, 'CART_ADDITION_ERROR'));
    }
};

export const purchaseCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cartId = req.params.cid;

        if (!userId) {
            return next(createError(400, 'USER_ID_MISSING'));
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(createError(404, 'USER_NOT_FOUND'));
        }

        const ticket = await purchaseCartService(cartId, userId);

        res.status(200).json({ success: true, message: 'Purchase completed successfully', ticket });
    } catch (error) {
        console.error('Error purchasing cart:', error); // Asegúrate de loguear el error
        next(createError(500, 'CART_PURCHASE_ERROR'));
    }
};

export const viewCart = async (req, res, next) => {
    try {
        const { cid } = req.params;
        const userId = req.user._id;
        const user = await User.findById(userId).populate({
            path: 'cart',
            populate: {
                path: 'products.productId'
            }
        });

        if (!user || !user.cart || !user.cart._id.equals(cid)) {
            return next(createError(404, 'CART_NOT_FOUND'));
        }

        const cart = user.cart;
        const totalAmount = cart.products.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);

        res.render('cart', { cart, totalAmount });
    } catch (error) {
        next(createError(500, 'CART_FETCH_ERROR'));
    }
};