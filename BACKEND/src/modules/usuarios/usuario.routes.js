import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from './usuario.controller.js';

import authMiddleware from '../../middlewares/auth.middleware.js';
import { checkRole } from '../../middlewares/role.middleware.js';

const router = Router();


// 🔹 SOLO ADMIN → ver todos los usuarios
router.get('/', authMiddleware, checkRole('admin'), getUsers);


// 🔹 USUARIO AUTENTICADO → ver un usuario
router.get('/:id', authMiddleware, getUser);


// 🔹 CREAR USUARIO (registro manual o admin)
router.post('/', createUser);


// 🔹 ACTUALIZAR USUARIO (admin o mismo usuario)
router.put('/:id', authMiddleware, updateUser);


// 🔹 ELIMINAR USUARIO (solo admin)
router.delete('/:id', authMiddleware, checkRole('admin'), deleteUser);


export default router;