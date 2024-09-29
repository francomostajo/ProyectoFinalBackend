<h1 align="center"> Entrega Proyecto Final BackEnd </h1>

---

- **`/src`**: Carpeta principal que contiene todo el código del backend.
  - **app.js**: Archivo principal de configuración y puesta en marcha del servidor Express.
  - **config.js**: Configuraciones generales de la aplicación.
  - **utils.js**: Utilidades generales utilizadas en varias partes del proyecto.
  
---

- **`/src/config`**: Configuración de autenticación.
  - **passport.config.js**: Configuración de Passport.js para la autenticación.
  
---

- **`/src/controllers`**: Controladores que manejan la lógica de negocio.
  - **auth.controller.js**: Controlador para gestionar la autenticación (registro, login, etc.).
  - **cart.controller.js**: Controlador para las operaciones de los carritos de compra.
  - **product.controller.js**: Controlador para la gestión de productos.
  - **user.controller.js**: Controlador para la gestión de usuarios.
  
---

- **`/src/dao`**: Data Access Objects (DAOs) para interactuar con la base de datos.
  - **socketManager.js**: Gestiona las conexiones de WebSocket.
  - **`/data`**: Almacena los DAO para productos y usuarios.
    - **productDao.js**: DAO para gestionar productos en la base de datos.
    - **userDao.js**: DAO para gestionar usuarios en la base de datos.
  - **`/models`**: Modelos Mongoose que definen las colecciones de MongoDB.
    - **cart.model.js**: Modelo del carrito de compras.
    - **message.model.js**: Modelo para el chat.
    - **product.model.js**: Modelo de producto.
    - **ticket.model.js**: Modelo de ticket de compra.
    - **user.model.js**: Modelo de usuario.
    
---

- **`/src/docs`**: Documentación de la API.
  - **Carts.yaml**: Documentación de la API relacionada con carritos.
  - **Products.yaml**: Documentación de la API relacionada con productos.
  
---

- **`/src/dto`**: Data Transfer Objects (DTOs) utilizados para definir el formato de los datos.
  - **user.dto.js**: DTO para los datos de usuario.
  
---

- **`/src/middleware`**: Middlewares para la autenticación y manejo de errores.
  - **auth.js**: Middleware de autenticación.
  - **errorHandler.js**: Manejo de errores en la aplicación.
  
---

- **`/src/public`**: Archivos públicos como JavaScript que se usan en el frontend.
  - **`/js`**: Archivos JavaScript para diferentes funcionalidades en el cliente.
    - **cart.js**: Lógica de frontend para la gestión del carrito.
    - **chat.js**: Lógica de frontend para el chat en tiempo real.
    - **products.js**: Lógica de frontend para la gestión de productos.
    - **realTimeProducts.js**: Lógica para actualizar productos en tiempo real.
    
---

- **`/src/routes`**: Rutas para la API y vistas.
  - **routesAuth.js**: Rutas relacionadas con la autenticación.
  - **routesCarts.js**: Rutas para gestionar carritos de compra.
  - **routeslogger.js**: Rutas de prueba para el logger.
  - **routesMessages.js**: Rutas para el sistema de mensajes (chat).
  - **routesmocking.js**: Rutas para mocking de datos.
  - **routesProducts.js**: Rutas para la gestión de productos.
  - **routesTest.js**: Rutas para pruebas del sistema.
  - **routesUsers.js**: Rutas para la gestión de usuarios.
  - **routesViews.js**: Rutas que gestionan las vistas del frontend.
  
---

- **`/src/service`**: Servicios que contienen la lógica de negocio.
  - **auth.service.js**: Servicios relacionados con la autenticación.
  - **cart.service.js**: Servicios relacionados con los carritos de compra.
  - **email.service.js**: Servicios para el envío de correos electrónicos.
  - **product.service.js**: Servicios para la gestión de productos.
  - **ticket.service.js**: Servicios para la gestión de tickets de compra.
  - **users.service.js**: Servicios para la gestión de usuarios.
  
---

- **`/src/utils`**: Funciones utilitarias.
  - **errorDictionary.js**: Diccionario de errores personalizados.
  - **logger.js**: Implementación del logger con Winston.
  - **mocking.js**: Funciones para mocking de datos.
  
---

- **`/src/views`**: Vistas Handlebars que se muestran en el frontend.
  - **admincontrol.handlebars**: Vista para controlar usuarios desde el panel de administración.
  - **cart.handlebars**: Vista del carrito de compras.
  - **chat.handlebars**: Vista del chat en tiempo real.
  - **home.handlebars**: Vista principal del home.
  - **login.handlebars**: Vista de inicio de sesión.
  - **products.handlebars**: Vista para mostrar los productos.
  - **realTimeProducts.handlebars**: Vista para productos en tiempo real.
  - **register.handlebars**: Vista de registro de usuarios.
  - **request-password-reset.handlebars**: Vista para solicitar el restablecimiento de contraseña.
  - **reset-password.handlebars**: Vista para restablecer la contraseña.
  - **`/layouts`**: Estructura base de las vistas.
    - **main.handlebars**: Layout principal que incluye las vistas parciales.

---

### Se comparte dos gif donde muestran las consignas de la entrega final 

---
 
 1.*Endpoints de routerProducts*

 
https://github.com/francomostajo/backendPreentregas/assets/137458693/f2b3cece-e9da-4c6c-9c8a-9741c4e0b2c8


 2.*Endpoints de roterCarts*
 

https://github.com/francomostajo/backendPreentregas/assets/137458693/f27b0d32-a3ba-470d-9560-0b3afd9edea7





