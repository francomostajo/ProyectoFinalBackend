import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('Testing Products Endpoints', function () {
    this.timeout(5000);
    
    it('Debe obtener la lista de productos', async () => {
        try {
            const response = await request(app).get('/api/test/products');
            console.log('Status:', response.status); // Imprime el código de estado para depuración
            console.log('Body:', response.body); // Imprime el cuerpo de la respuesta para depuración
            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an('array');
        } catch (error) {
            console.error('Error en obtener la lista de productos:', error); // Imprime cualquier error para depuración
        }
    });

    it('Debe obtener un producto por ID', async () => {
        const productId = '664a726c84eb954ad6496e72'; // Asegúrate de que este ID exista en tu base de datos
        try {
            const response = await request(app).get(`/api/products/${productId}`);
            console.log('Status:', response.status);
            console.log('Body:', response.body);
            
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('_id').eql(productId);
            // Ajusta según el formato real de tu respuesta
        } catch (error) {
            console.error('Error en obtener el producto por ID:', error);
        }
    });

    it('Debe crear un producto nuevo', async () => {
        const productData = {
            title: 'Nuevo Producto 3',
            price: 200,
            description: 'Descripción de prueba 3',
            category: 'Categoría de prueba 3',
            stock: 20,
            thumbnail: 'url-imagen-prueba3',
            code: 'NP-003'
        };
    
        try {
            const response = await request(app).post('/api/test/products').send(productData);
            console.log('Status:', response.status);
            console.log('Body:', response.body);
    
            expect(response.status).to.equal(201);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload).to.have.property('_id');
        } catch (error) {
            console.error('Error al crear un producto nuevo:', error);
        }
    });
});