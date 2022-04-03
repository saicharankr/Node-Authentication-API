exports.responseHandler = (res, error, statusCode, message,data) => {
  res.status(statusCode).json({
    error: error,
    message: message,
    data:data
  });
};
