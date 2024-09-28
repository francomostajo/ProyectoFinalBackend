import { findProducts, findCategories } from '../dao/data/productDao.js';
import { sendProductDeletionEmail } from './email.service.js'; // Importa la función de mailer

export const getProducts = async (query) => {
    const { limit = 10, page = 1, sort, query: searchQuery, categories } = query;
    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort ? { price: sort } : {},
    };

    let filter = {};
    if (searchQuery) {
        filter.name = { $regex: searchQuery, $options: 'i' };
    }
    if (categories) {
        filter.category = { $in: categories.split(',') };
    }

    if (isNaN(options.page) || options.page < 1 || isNaN(options.limit) || options.limit < 1) {
        throw new Error('Número de página o límite inválido');
    }

    const products = await findProducts(filter, options);

    if (options.page > products.totalPages) {
        throw new Error('Página no encontrada');
    }

    return products;
};
// Enviar notificación cuando un producto es eliminado
export const deleteProduct = async (productId, userEmail, productName) => {
    // Lógica para eliminar el producto...
    await sendProductDeletionEmail(userEmail, productName); // Envía el correo al usuario
    return { message: `Producto ${productName} eliminado y correo enviado` };
};

export const getCategories = async () => {
    return await findCategories();
};