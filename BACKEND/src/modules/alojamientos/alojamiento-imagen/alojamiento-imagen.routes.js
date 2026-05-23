import { Router } from 'express';

import * as ctrl from './alojamiento-imagen.controller.js';

import auth from '../../../middlewares/auth.middleware.js';

import { checkRole } from '../../../middlewares/role.middleware.js';

import validate from '../../../middlewares/validate.middleware.js';

import upload from '../../../middlewares/upload.middleware.js';

import {
  createAlojamientoImagenSchema
} from './alojamiento-imagen.schema.js';

const router = Router();


// =========================
// SUBIR IMAGEN
// =========================

router.post(
  '/',
  auth,
  checkRole('anfitrion'),
  upload.single('imagen'),
  validate(createAlojamientoImagenSchema),
  ctrl.create
);


// =========================
// OBTENER IMAGENES
// =========================

router.get(
  '/alojamiento/:id_alojamiento',
  ctrl.getByAlojamiento
);


// =========================
// ELIMINAR
// =========================

router.delete(
  '/:id',
  auth,
  checkRole('anfitrion'),
  ctrl.remove
);

export default router;