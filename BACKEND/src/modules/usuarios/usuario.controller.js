import * as userService from './usuario.service.js';


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
    const user = await userService.updateUserService(
      req.params.id,
      req.body
    );

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