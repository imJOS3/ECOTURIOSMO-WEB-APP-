// unidad.routes.js

import { Router } from 'express';

import * as ctrl from './unidad.controller.js';

import auth from '../../middlewares/auth.middleware.js';
import authOptional from '../../middlewares/authOptional.middleware.js';

import { checkRole } from '../../middlewares/role.middleware.js';

import validate from '../../middlewares/validate.middleware.js';

import { createUnidadSchema, updateUnidadSchema } from './unidad.schema.js';

const router = Router();


// =========================
// CREAR
// =========================

router.post(
  '/',
  auth,
  checkRole('anfitrion'),
  validate(createUnidadSchema),
  ctrl.create
);

// =========================
// VER MIS UNIDADES
// =========================

router.get(
  '/mine',
  auth,
  checkRole('anfitrion'),
  ctrl.getMine
);

// =========================
// VER TODAS POR ALOJAMIENTO
// =========================

router.get(
  '/alojamiento/:id',
  authOptional,
  ctrl.getByAlojamiento
);


// =========================
// OBTENER UNA UNIDAD
// =========================

router.get(
  '/:id',
  authOptional,
  ctrl.getById
);

// =========================
// ACTUALIZAR
// =========================

router.put(
  '/:id',
  auth,
  checkRole('anfitrion'),
  validate(updateUnidadSchema),
  ctrl.update
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