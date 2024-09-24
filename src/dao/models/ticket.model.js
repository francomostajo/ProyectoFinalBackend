import mongoose from 'mongoose';

const ticketCollection = "tickets";

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'productos' }, // Cambiado de 'product' a 'productos'
            quantity: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    purchaser: { type: String, required: true }  // Correo del usuario
}, { timestamps: true });

const Ticket = mongoose.model(ticketCollection, ticketSchema);

export default Ticket;