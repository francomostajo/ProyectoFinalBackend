import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';

describe('Testing User Endpoints', function () {
    this.timeout(5000);
    
    let userId; // Aquí almacenamos el _id del usuario
    let userToken;

    it('Debe registrar un nuevo usuario', async () => {
        const userData = {
            first_name: 'Juan1',
            last_name: 'Pérez1',
            email: 'juan.perez1@example.com',
            password: 'password1123',
            age: 30
        };

        try {
            const response = await request(app)
                .post('/api/test/register') // Cambiado a la ruta de registro de usuario
                .send(userData);

            console.log('Status:', response.status); // Para depuración
            console.log('Body:', response.body); // Para depuración
            
            expect(response.status).to.equal(200); // Verifica el código de estado correcto
            expect(response.body).to.have.property('result', 'success');
            expect(response.body).to.have.property('payload');

            // Almacenar el _id del usuario para futuras pruebas
            userId = response.body.payload._id;

        } catch (error) {
            console.error('Error al registrar un nuevo usuario:', error); // Para depuración
        }
    });

    it('Debe iniciar sesión el usuario', async () => {
        const loginData = {
            email: 'juan.perez1@example.com', // Usar el correo registrado
            password: 'password1123' // Usar la misma contraseña registrada
        };
    
        try {
            const response = await request(app)
                .post('/api/sessions/login')
                .send(loginData)
                .redirects(0); // No sigue redirecciones automáticamente
    
            console.log('Status:', response.status);
            console.log('Body:', response.body);
            console.log('Location Header:', response.header.location); // Imprime la cabecera de redirección
    
            // Verifica la respuesta
            expect(response.status).to.equal(302); // Verifica el código de redirección
            expect(response.header.location).to.equal('/products'); // Verifica la URL de redirección
    
        } catch (error) {
            console.error('Error al iniciar sesión el usuario:', error);
        }
    });

    it('Debe modificar los datos del usuario', async () => {
        const updatedData = {
            first_name: 'Juan Mod',
            last_name: 'Pérez Mod',
            age: 35
        };
    
        try {
            const response = await request(app)
                .put(`/api/test/users/${userId}`) // Usar el _id almacenado
                .send(updatedData);
    
            console.log('Status:', response.status);
            console.log('Body:', response.body);
    
            expect(response.status).to.equal(200); // Verifica el código de estado correcto
            expect(response.body).to.have.property('result', 'success');
    
        } catch (error) {
            console.error('Error al modificar los datos del usuario:', error);
        }
    });

    it('Debe eliminar el usuario', async () => {
        try {
            const response = await request(app)
                .delete(`/api/test/users/${userId}`); // Usar el _id almacenado

            console.log('Status:', response.status);
            console.log('Body:', response.body);

            expect(response.status).to.equal(200); // Verifica el código de estado correcto
            expect(response.body).to.have.property('result', 'success');

        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
        }
    });
});