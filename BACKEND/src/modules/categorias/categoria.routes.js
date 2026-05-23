import { Router } from 'express';

import * as ctrl from './categoria.controller.js';

import auth from '../../middlewares/auth.middleware.js';

import { checkRole } from '../../middlewares/role.middleware.js';

import validate from '../../middlewares/validate.middleware.js';

import {
  categoriaSchema
} from './categoria.schema.js';

const router = Router();


// =========================
// PUBLICO
// =========================

router.get(
  '/',
  ctrl.getAll
);

router.get(
  '/:id',
  ctrl.getById
);


// =========================
// ADMIN
// =========================

router.post(
  '/',
  auth,
  checkRole('admin'),
  validate(categoriaSchema),
  ctrl.create
);

router.put(
  '/:id',
  auth,
  checkRole('admin'),
  validate(categoriaSchema),
  ctrl.update
);

router.delete(
  '/:id',
  auth,
  checkRole('admin'),
  ctrl.remove
);

export default router;