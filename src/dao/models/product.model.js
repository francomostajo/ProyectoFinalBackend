import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'productos';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true, maxLength: 1000 },
    price: { type: Number, required: true, min: 0 },
    code: { type: String, required: true, unique: true, maxLength: 50 },
    stock: { type: Number, required: true, min: 0 },
    thumbnail: { type: String, required: true, maxLength: 255 },
    category: { type: String, required: true, maxLength: 100 },
    status: { type: Boolean, required: true, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Campo para el propietario del producto
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;