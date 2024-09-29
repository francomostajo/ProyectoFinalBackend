import mongoose from 'mongoose';
import { getProducts as fetchProducts, getCategories as fetchCategories, deleteProduct as removeProduct } from '../service/product.service.js'; // Asegúrate de que esta ruta sea correcta
import createError from 'http-errors';
import ProductModel from '../dao/models/product.model.js';

export const getProducts = async (req, res, next) => {
    try {
        const products = await fetchProducts(req.query);
        res.json({
            status: 'success',
            payload: products.docs,
            totalPages: products.totalPages,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
        });
    } catch (error) {
        next(createError(500, 'PRODUCT_FETCH_ERROR'));
    }
};

export const getCategories = async (req, res, next) => {
    try {
        const categories = await fetchCategories();
        res.json({ status: 'success', categories });
    } catch (err) {
        next(createError(500, 'CATEGORY_FETCH_ERROR'));
    }
};

export const getProductById = async (req, res, next) => {
    const { pid } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(pid)) {
            return next(createError(400, 'Invalid Product ID'));
        }

        const product = await ProductModel.findById(pid).lean();
        if (!product) {
            return next(createError(404, 'PRODUCT_NOT_FOUND'));
        }
        res.json(product);
    } catch (error) {
        next(createError(500, 'PRODUCT_FETCH_ERROR'));
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const { user } = req; // El usuario autenticado
        const productData = req.body;

        if (user.role === 'premium') {
            productData.owner = user._id; // Asignar el propietario solo si es premium
        }

        const newProduct = await ProductModel.create(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        next(createError(500, 'PRODUCT_CREATION_ERROR'));
    }
};

export const updateProduct = async (req, res, next) => {
    const { pid } = req.params;
    const updatedProductData = req.body;
    const { user } = req; // Obtener al usuario autenticado

    try {
        const product = await ProductModel.findById(pid);

        if (!product) {
            return next(createError(404, 'PRODUCT_NOT_FOUND'));
        }

        // Verificar que el usuario sea el dueño o un administrador
        if (user.role === 'premium' && product.owner.toString() !== user._id.toString()) {
            return next(createError(403, 'NO_PERMISSION_TO_EDIT_PRODUCT'));
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(pid, updatedProductData, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        next(createError(500, 'PRODUCT_UPDATE_ERROR'));
    }
};

export const deleteProduct = async (req, res, next) => {
    const { pid } = req.params;
    const { user } = req;

    try {

        // Verificar que el producto existe
        const product = await ProductModel.findById(pid).lean();
        if (!product) {
            console.error('Producto no encontrado');
            return next(createError(404, 'PRODUCT_NOT_FOUND'));
        }
        // Verificar permisos (usuario premium y propietario o admin)
        if (user.role === 'premium' && product.owner.toString() !== user._id.toString()) {
            console.error('No tiene permisos para eliminar el producto');
            return next(createError(403, 'NO_PERMISSION_TO_DELETE_PRODUCT'));
        }
        // Llamada a la función para eliminar el producto
        const result = await removeProduct(pid, user.email, product.title, user.role);
        res.json(result); // Respuesta exitosa
    } catch (error) {
        console.error('Error al eliminar el producto:', error); // Log para rastrear el error
        next(createError(500, 'PRODUCT_DELETION_ERROR'));
    }
};

export const viewProducts = async (req, res, next) => {
    try {
        const { user } = req;
        const { page = 1, limit = 10, sort, query } = req.query;

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
            lean: true,
        };

        const searchQuery = query
            ? {
                $or: [
                    { category: { $regex: query, $options: 'i' } },
                    { name: { $regex: query, $options: 'i' } },
                ],
            }
            : {};

        const products = await ProductModel.paginate(searchQuery, options);
        res.render('home', {
            user,
            products: products.docs,
            totalPages: products.totalPages,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            currentPage: page,
            limit,
            sort,
            query,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.role === 'admin',
        });
    } catch (error) {
        next(createError(500, 'PRODUCT_FETCH_ERROR'));
    }
};

export const realTimeProducts = async (req, res, next) => {
    try {
        const { user } = req;
        const products = await ProductModel.find().lean();
        res.render('realTimeProducts', {
            user,
            products,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.role === 'admin',
        });
    } catch (error) {
        next(createError(500, 'PRODUCT_FETCH_ERROR'));
    }
};