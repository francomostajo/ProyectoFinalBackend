import Cart from '../dao/models/cart.model.js';
import User from '../dao/models/user.model.js';
import Ticket from '../dao/models/ticket.model.js';
import { sendPurchaseEmail } from './email.service.js';
import crypto from 'crypto'; // Asegúrate de importar 'crypto'

export const getAllCarts = async () => {
    try {
        return await Cart.find().populate('products.productId').lean();
    } catch (error) {
        throw new Error('Error al obtener los carritos');
    }
};

export const createCart = async (products) => {
    try {
        const cart = new Cart({ products });
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error('No se pudo crear el carrito');
    }
};

export const addProductToCart = async (cartId, productId) => {
    try {
        const cart = await Cart.findById(cartId);
        const existingProductIndex = cart.products.findIndex(p => p.productId.equals(productId));
        if (existingProductIndex >= 0) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ productId, quantity: 1 });
        }
        await cart.save();
        return cart;
    } catch (error) {
        throw new Error('Error al agregar producto al carrito');
    }
};

export const addProductToUserCart = async (userId, productId, quantity) => {
    try {
        let user = await User.findById(userId).populate('cart');
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (!user.cart) {
            const newCart = new Cart({ products: [] });
            user.cart = newCart._id;
            await newCart.save();
            await user.save();
        }

        const cart = await Cart.findById(user.cart._id);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(p => p.productId.equals(productId));
        if (productIndex >= 0) {
            cart.products[productIndex].quantity += parseInt(quantity);
        } else {
            cart.products.push({ productId, quantity: parseInt(quantity) });
        }

        await cart.save();
        return cart;
    } catch (error) {
        throw new Error('Error al agregar el producto al carrito');
    }    
};

export const purchaseCart = async (cartId, userId) => {
    try {
        const cart = await Cart.findById(cartId).populate('products.productId');
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        if (cart.products.length === 0) {
            throw new Error('El carrito está vacío');
        }

        const totalAmount = cart.products.reduce((acc, item) => acc + (item.productId.price * item.quantity), 0);
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const ticket = new Ticket({
            code: crypto.randomBytes(8).toString('hex'),
            userId,
            cartId,
            products: cart.products,
            totalAmount,
            purchaser: user.email
        });

        await ticket.save();

        await sendPurchaseEmail(user, {
            code: ticket.code,
            totalAmount,
            products: cart.products
        });

        // Vaciar el carrito
        cart.products = [];
        await cart.save();

        return ticket;
    } catch (error) {
        console.error('Error al realizar la compra:', error);
        throw new Error('Error al realizar la compra: ' + error.message);
    }
};