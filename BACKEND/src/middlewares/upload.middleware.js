import multer from 'multer';

import {
  CloudinaryStorage
} from 'multer-storage-cloudinary';

import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({

  cloudinary,

  params: {

    folder: 'alojamientos',

    allowed_formats: [
      'jpg',
      'jpeg', 
      'png',
      'webp'
    ]
  }
});

const fileFilter = (req, file, cb) => {

  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no permitido'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter
});

export default upload;