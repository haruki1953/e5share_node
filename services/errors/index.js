const ClientError = require('./ClientError');
const ServerError = require('./ServerError');

const { logWarn, logError } = require('../../utils/logger');

// 错误处理函数，将判断状态码，并拼接errorString
const errorHandler = (error, errorString) => {
  let status;
  let message;
  if (error instanceof ClientError) {
    status = 400;
    message = `${errorString}: ${error.message}`;
    logWarn(error, { file: 'errors/index.js', method: 'errorHandler: ClientError', message });
  } else if (error instanceof ServerError) {
    status = 500;
    message = `${errorString}: ${error.message}`;
    logWarn(error, { file: 'errors/index.js', method: 'errorHandler: ServerError', message });
  } else {
    status = 500;
    message = `${errorString}: 发生未知错误`;
    logError(
      error,
      { file: 'errors/index.js', method: 'errorHandler', message },
    );
  }

  return { message, status };
};

module.exports = {
  errorHandler,
  ClientError,
  ServerError,
};
