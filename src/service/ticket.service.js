import Ticket from '../dao/models/ticket.model.js';
import Cart from '../dao/models/cart.model.js';
import { v4 as uuidv4 } from 'uuid';

export const createTicket = async (userId, cartId, purchaserEmail) => {
    try {
        const cart = await Cart.findById(cartId).populate('products.productId');
        if (!cart) {
            throw new Error('Cart not found');
        }

        const products = cart.products.map(product => ({
            productId: product.productId._id,
            title: product.productId.title,
            price: product.productId.price,
            quantity: product.quantity
        }));

        const totalAmount = products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);

        const ticket = new Ticket({
            code: uuidv4(),
            userId,
            cartId,
            products,  // Asegúrate de que esto se pase como un array
            totalAmount,
            purchaser: purchaserEmail  // Usar el email pasado como parámetro
        });

        await ticket.save();

        // Limpiar el carrito después de crear el ticket
        cart.products = [];
        await cart.save();

        return ticket;
    } catch (error) {
        console.error('Error creating ticket:', error);
        throw new Error('Error creating ticket: ' + error.message);
    }
};