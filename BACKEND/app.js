import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import routes from './src/routes/index.js';
import errorMiddleware from './src/middlewares/error.middleware.js';
import { swaggerConfig } from './src/config/swagger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// ruta base
app.get('/', (req, res) => {
  res.json({
    message: 'API Ecoturismo 🚀',
    docs: '/api/docs'
  });
});

// OpenAPI / Swagger UI
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerConfig, {
    customSiteTitle: 'EcoTurismo API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true
    }
  })
);

// Spec JSON crudo (útil para importar en Postman / Insomnia)
app.get('/api/docs.json', (_req, res) => {
  res.json(swaggerConfig);
});

// 🔥 UNA SOLA LÍNEA PARA TODAS LAS RUTAS
app.use('/api', routes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// errores
app.use(errorMiddleware);

export default app;
