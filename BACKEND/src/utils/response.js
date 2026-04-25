export const success = (res, data, status = 200) => {
  return res.status(status).json({
    success: true,
    data
  });
};

export const error = (res, message, status = 500) => {
  return res.status(status).json({
    success: false,
    message
  });
};