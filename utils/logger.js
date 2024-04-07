const fs = require('fs');
const { logConfig } = require('../config');

// 创建日志文件夹（如果不存在）
if (!fs.existsSync(logConfig.logPath)) {
  fs.mkdirSync(logConfig.logPath);
}

// 记录日志
const log = (logFile, data) => {
  // 获取当前时间戳
  const timestamp = new Date().toISOString();

  // 日志数据
  const jsonLog = { ...data, timestamp };

  // 格式化日志消息
  const logMessage = `${JSON.stringify(jsonLog)}\n`;

  // 写入日志文件
  fs.appendFileSync(logFile, logMessage, { flag: 'a' }); // 使用追加模式
};

// 记录用户日志
// const logUser = (message) => {
//   log(logConfig.user.file, message);
// };

// 记录网站日志，在响应后调用，info为参数之类的相关信息
const logWeb = async (req, res, info = null) => {
  try {
    const logData = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userId: req.user?.id || null,
      statusCode: res.statusCode,
      info,
    };
    log(logConfig.web.file, logData);
  } catch (error) {
    console.error('logUser: ', error);
  }
};

// 记录管理员日志
const logAdmin = (data) => {
  log(logConfig.admin.file, data);
};

module.exports = {
  logWeb,
  // logUser,
  logAdmin,
};
