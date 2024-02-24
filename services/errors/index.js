const ClientError = require('./ClientError');
const ServerError = require('./ServerError');

// 错误处理函数，将判断状态码，并拼接errorString
const errorHandler = (error, errorString) => {
  let status;
  let message;
  if (error instanceof ClientError) {
    status = 400; // Bad Request
    message = `${errorString}: ${error.message}`;
  } else if (error instanceof ServerError) {
    status = 500; // Internal Server Error
    message = `${errorString}: ${error.message}`;
  } else {
    status = 500; // Default to Internal Server Error for unknown errors
    message = `${errorString}: 发生未知错误`;
  }

  return { message, status };
};

module.exports = {
  errorHandler,
  ClientError,
  ServerError,
};
