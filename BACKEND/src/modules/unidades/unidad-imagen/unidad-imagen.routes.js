import { Router } from 'express';

import * as ctrl from './unidad-imagen.controller.js';

import auth from '../../../middlewares/auth.middleware.js';

import { checkRole } from '../../../middlewares/role.middleware.js';

import validate from '../../../middlewares/validate.middleware.js';

import upload from '../../../middlewares/upload.middleware.js';

import {
  createUnidadImagenSchema
} from './unidad-imagen.schema.js';

const router = Router();


// =========================
// SUBIR IMAGEN
// =========================

router.post(
  '/',
  auth,
  checkRole('anfitrion'),
  validate(createUnidadImagenSchema), 
  upload.single('imagen'),            
  ctrl.create
);


// =========================
// OBTENER IMAGENES
// =========================

router.get(
  '/unidad/:id_unidad',
  ctrl.getByUnidad
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