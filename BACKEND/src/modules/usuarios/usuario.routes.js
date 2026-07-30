import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  deleteAvatar,
  deleteUser
} from './usuario.controller.js';

import authMiddleware from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';
import { uploadAvatar } from '../../middlewares/upload.middleware.js';

const router = Router();

// 🔹 SOLO ADMIN → ver todos los usuarios
router.get('/', authMiddleware, checkRole('admin'), getUsers);

// 🔹 USUARIO AUTENTICADO → ver un usuario
router.get('/:id', authMiddleware, getUser);

// 🔹 CREAR USUARIO (registro manual o admin)
router.post('/', createUser);

// 🔹 ACTUALIZAR USUARIO (admin o mismo usuario)
router.put('/:id', authMiddleware, updateUser);

// 🔹 FOTO DE PERFIL (admin o mismo usuario)
router.put(
  '/:id/avatar',
  authMiddleware,
  uploadAvatar.single('avatar'),
  updateAvatar
);

router.delete('/:id/avatar', authMiddleware, deleteAvatar);

// 🔹 ELIMINAR USUARIO (solo admin)
router.delete('/:id', authMiddleware, checkRole('admin'), deleteUser);

export default router;
