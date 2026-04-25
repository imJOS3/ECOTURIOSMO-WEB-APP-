import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import routes from './src/routes/index.js';
import errorMiddleware from './src/middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// ruta base
app.get('/', (req, res) => {
  res.json({ message: 'API Ecoturismo 🚀' });
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