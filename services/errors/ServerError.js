// 用于代表服务端错误
class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
