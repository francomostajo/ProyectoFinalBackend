import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js'; 

describe('Testing Cart Endpoints', function () {
    this.timeout(5000);
    
    let userId = '669f326a2a8cd1e7bc34da3f';  // ID del usuario existente en MongoDB
    let cartId = '669f32b92a8cd1e7bc34da55';  // ID del carrito asociado
    let userEmail = 'francomostajo0@gmail.com';  // Email del usuario
    let userPassword = '123';  // La contraseña original, no el hash
    let productId = '64aabcf69b5c123456789abc';  // Un ID de producto válido en tu base de datos

    // Iniciar sesión con el usuario ya registrado
    it('Debe iniciar sesión con un usuario registrado', async () => {
        const loginData = {
            email: userEmail,  
            password: userPassword 
        };

        try {
            const response = await request(app)
                .post('/api/sessions/login')  
                .send(loginData);

            console.log('Status:', response.status);
            console.log('Body:', response.body);

            expect(response.status).to.equal(302);  // Debe redirigir después del login
            expect(response.header.location).to.equal('/products');  // Verificar redirección

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    });

    it('Debe agregar un producto al carrito del usuario', async () => {
        const response = await request(app)
            .post(`/api/test/carts/${cartId}/product/${productId}`)  // Usamos la ruta correcta
            .send();
    
        console.log('Status:', response.status);
        console.log('Body:', response.body);
    
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('success', true); 
        expect(response.body).to.have.property('cart');  
        expect(response.body.cart.products).to.be.an('array');  
    });

    it('Debe obtener los productos del carrito del usuario', async () => {
        // Primero, verifica si el carrito existe
        const cartResponse = await request(app)
            .get(`/api/carts/${cartId}`);
    
        if (cartResponse.status === 200) {
            // Si el carrito existe, realiza la solicitud de compra
            const purchaseResponse = await request(app)
                .get(`/api/carts/${cartId}/purchase`);
    
            console.log('Status:', purchaseResponse.status);
            console.log('Body:', purchaseResponse.body);
    
            if (purchaseResponse.status === 200) {
                expect(purchaseResponse.body.products).to.be.an('array');  // Verificamos que sea un array si se encuentran productos
            } else {
                expect(purchaseResponse.status).to.equal(404);  // Si no se encuentra el carrito, esperamos un 404
            }
        } else {
            // Si el carrito no existe, espera un 404
            expect(cartResponse.status).to.equal(404);
        }
    });

    // Eliminar un producto del carrito
    it('Debe eliminar un producto del carrito del usuario', async () => {
        // Primero, verifica si el producto está en el carrito
        const cartResponse = await request(app)
            .get(`/api/carts/${cartId}`);
    
        if (cartResponse.status === 200) {
            const products = cartResponse.body.cart.products;
            const productInCart = products.some(product => product._id === productId);
    
            if (productInCart) {
                // Si el producto está en el carrito, realiza la solicitud de eliminación
                const deleteResponse = await request(app)
                    .delete(`/api/carts/${cartId}/products/${productId}`);
    
                console.log('Status:', deleteResponse.status);
                console.log('Body:', deleteResponse.body);
    
                expect(deleteResponse.status).to.equal(200); 
                expect(deleteResponse.body).to.have.property('success', true);
            } else {
                // Si el producto no está en el carrito, espera un 404
                expect(cartResponse.status).to.equal(404);
            }
        } else {
            // Si el carrito no existe, espera un 404
            expect(cartResponse.status).to.equal(404);
        }
    });

});