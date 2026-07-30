import { Router } from 'express';
import * as ctrl from './alojamiento-imagen.controller.js';
import auth from '../../../middlewares/auth.middleware.js';
import { checkRole } from '../../../middlewares/role.middleware.js';
import validate from '../../../middlewares/validate.middleware.js';
import upload from '../../../middlewares/upload.middleware.js';
import {
  createAlojamientoImagenSchema,
  updateEspacioSchema,
} from './alojamiento-imagen.schema.js';

const router = Router();

// multer primero: parsea multipart y deja id_alojamiento / espacio en req.body
router.post(
  '/',
  auth,
  checkRole('anfitrion'),
  upload.single('imagen'),
  validate(createAlojamientoImagenSchema),
  ctrl.create
);

router.put(
  '/:id',
  auth,
  checkRole('anfitrion'),
  upload.single('imagen'),
  ctrl.update
);

router.patch(
  '/:id/espacio',
  auth,
  checkRole('anfitrion'),
  validate(updateEspacioSchema),
  ctrl.updateEspacio
);

router.get(
  '/alojamiento/:id_alojamiento',
  ctrl.getByAlojamiento
);

router.delete(
  '/:id',
  auth,
  checkRole('anfitrion'),
  ctrl.remove
);

export default router;
