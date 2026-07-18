import { Router } from 'express';

// importar módulos
import authRoutes from '../modules/auth/auth.routes.js';
import usuarioRoutes from '../modules/usuarios/usuario.routes.js';
import alojamientoRoutes from '../modules/alojamientos/alojamiento.routes.js';
import reservaRoutes from '../modules/reservas/reserva.routes.js';
import pagoRoutes from '../modules/pagos/pago.routes.js';
import resenaRoutes from '../modules/resenas/resena.routes.js';
import categoriaRoutes from '../modules/categorias/categoria.routes.js';
import unidadRoutes from '../modules/unidades/unidad.routes.js';
import moderacionRoutes from '../modules/moderacion/moderacion.routes.js';
import unidadImagenRoutes from '../modules/unidades/unidad-imagen/unidad-imagen.routes.js';
import alojamientoImagenRoutes from '../modules/alojamientos/alojamiento-imagen/alojamiento-imagen.routes.js';



const router = Router();

// agrupar rutas 
router.use('/unidades', unidadRoutes);
router.use('/auth', authRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/alojamientos', alojamientoRoutes);
router.use('/reservas', reservaRoutes);
router.use('/pagos', pagoRoutes);
router.use('/resenas', resenaRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/admin/moderacion', moderacionRoutes);

router.use(
  '/unidad-imagen',
  unidadImagenRoutes
);

router.use(
  '/alojamiento-imagen',
  alojamientoImagenRoutes
);


export default router;