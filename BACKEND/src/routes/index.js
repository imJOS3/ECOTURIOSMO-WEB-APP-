import { Router } from 'express';

// importar módulos
import authRoutes from '../modules/auth/auth.routes.js';
import usuarioRoutes from '../modules/usuarios/usuario.routes.js';
import alojamientoRoutes from '../modules/alojamientos/alojamiento.routes.js';
import reservaRoutes from '../modules/reservas/reserva.routes.js';
import pagoRoutes from '../modules/pagos/pago.routes.js';
import resenaRoutes from '../modules/resenas/resena.routes.js';
import categoriaRoutes from '../modules/categorias/categoria.routes.js';
import servicioRoutes from '../modules/servicios/servicio.routes.js';
import moderacionRoutes from '../modules/moderacion/moderacion.routes.js';
import alojamientoImagenRoutes from '../modules/alojamientos/alojamiento-imagen/alojamiento-imagen.routes.js';
import mensajeRoutes from '../modules/mensajes/mensaje.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/alojamientos', alojamientoRoutes);
router.use('/reservas', reservaRoutes);
router.use('/pagos', pagoRoutes);
router.use('/resenas', resenaRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/servicios', servicioRoutes);
router.use('/mensajes', mensajeRoutes);
router.use('/admin/moderacion', moderacionRoutes);

router.use(
  '/alojamiento-imagen',
  alojamientoImagenRoutes
);

export default router;
