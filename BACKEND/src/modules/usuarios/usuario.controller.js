import * as userService from './usuario.service.js';

const canManageUser = (req, userId) => {
  const id = Number(userId);
  return req.user?.rol === 'admin' || Number(req.user?.id) === id;
};

// 🔹 Obtener todos los usuarios
export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// 🔹 Obtener un usuario por ID
export const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUser(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// 🔹 Crear usuario
export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUserService(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

// 🔹 Actualizar usuario
export const updateUser = async (req, res, next) => {
  try {
    if (!canManageUser(req, req.params.id)) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const user = await userService.updateUserService(
      req.params.id,
      req.body
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// 🔹 Subir / cambiar foto de perfil
export const updateAvatar = async (req, res, next) => {
  try {
    if (!canManageUser(req, req.params.id)) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Imagen requerida' });
    }

    const user = await userService.updateAvatarService(req.params.id, {
      url: req.file.path,
      public_id: req.file.filename,
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// 🔹 Eliminar foto de perfil
export const deleteAvatar = async (req, res, next) => {
  try {
    if (!canManageUser(req, req.params.id)) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    const user = await userService.deleteAvatarService(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
};

// 🔹 Eliminar usuario
export const deleteUser = async (req, res, next) => {
  try {
    const result = await userService.deleteUserService(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
