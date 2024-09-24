import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import flash from 'express-flash';
import cors from 'cors';

import routesProduct from './routes/routesProducts.js';
import routesCart from './routes/routesCarts.js';
import routesUser from './routes/routesUsers.js';
import routesMessages from './routes/routesMessages.js';
import routesView from './routes/routesViews.js';
import routesAuth from './routes/routesAuth.js';
import mockingRoutes from './routes/routesMocking.js';
import loggerTestRoute from './routes/routesLogger.js';
import routerTest from './routes/routesTest.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';

// Inicializa la aplicación de Express
import __dirname from './utils.js';
import { initializeSockets } from './dao/socketManager.js';
import initializePassport from './config/passport.config.js';
import { PORT, MONGO_URL } from './config.js';
import errorHandler from './middleware/errorHandler.js'; 
import logger from './utils/logger.js'; // Importar el logger

const app = express();
const httpServer = app.listen(PORT, () => logger.info('Server running on port ${PORT}')); // Usar logger
const socketServer = new Server(httpServer);

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación de la API",
            description: "API Swagger para el proyecto"
        }
    },
    apis: ['src/docs/**/*.yaml'] // Cambia la ruta según la ubicación de tus archivos de rutas
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URL }),
}));

app.use(flash());
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use('/api/products', routesProduct);
app.use('/api/carts', routesCart);
app.use('/api/users', routesUser);
app.use('/api/chat', routesMessages);
app.use('/api/sessions', routesAuth);
app.use('/api', mockingRoutes);
app.use('/api/loggerTest', loggerTestRoute);
app.use('/', routesView);
app.use('/api/test', routerTest);

initializeSockets(socketServer);

app.use(errorHandler); 

mongoose.connect(MONGO_URL)
    .then(() => { logger.info("Conectado a la base de datos") }) // Usar logger
    .catch(error => logger.error("Error en la conexión", error)); // Usar logger

export default app;
export { socketServer };