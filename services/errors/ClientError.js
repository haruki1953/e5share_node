// 用于代表客户端错误
class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
