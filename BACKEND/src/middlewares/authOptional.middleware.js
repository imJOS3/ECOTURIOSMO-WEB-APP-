// middlewares/authOptional.middleware.js

import jwt from 'jsonwebtoken';

const authOptional = (req, res, next) => {

  const authHeader = req.headers.authorization;

  // No token -> público
  if (!authHeader) {
    req.user = null;
    return next();
  }

  try {

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    // Token inválido -> sigue como público
    req.user = null;

    next();
  }
};

export default authOptional;