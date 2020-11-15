const { MONGO_ERROR, MONGO_VALIDATION_ERROR, API_ERROR } = require('../utils/config');
const colors = require('colors/safe');

module.exports.errorHandlerFunc = async (err, req, res, next) => {
  const { name } = err;
  let { message, statusCode, originalError } = err;
  const isDev = process.env.NODE_ENV === 'development';
  switch (true) {
    case name === MONGO_ERROR && err.code === 11000:
      statusCode = 400;
      message = `${Object.getOwnPropertyNames(err.keyValue)[0]} has been used, please provide different value`;
      originalError = err;
      break;
    case name === MONGO_VALIDATION_ERROR:
      statusCode = 400;
      message = err.message;
      originalError = err;
      break;
    case name === API_ERROR:
      break;
    default:
      statusCode = 500;
      message = err.message;
      originalError = err;
  }
  if (isDev) { console.log(colors.red(err.stack)); }
  res.status(statusCode);
  res.json({
    status: 'failed',
    message: message,
    data: isDev ? originalError : null,
    stack: isDev ? err.stack : null
  });
  next();
};
