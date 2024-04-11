const fs = require('fs');
const path = require('path');
const { logConfig } = require('../config');

// 解析备份日志，获取日志类型
const getLogTypeFromFileName = (fileName) => {
  const parts = fileName.split('.');
  // 第一个为日志类型
  return parts[0];
};

// 解析备份文件名，获取时间戳
const getTimeFromFileName = (fileName) => {
  const parts = fileName.split('.');
  // 倒数第二个后缀为备份时间
  const timestampString = parts[parts.length - 2];
  return parseInt(timestampString, 10);
};

// 删除多余的备份文件
const deleteExcessBackups = (backupList, maxBackups) => {
  if (backupList.length > maxBackups) {
    const backupsToDelete = backupList.slice(maxBackups);
    backupsToDelete.forEach((backup) => {
      const filePath = path.join(logConfig.backupPath, backup);
      fs.unlinkSync(filePath);
    });
  }
};

// 获取日志文件大小
const getLogFileSize = (logFile) => {
  const stats = fs.statSync(logFile);
  return stats.size;
};

// 切割日志文件
const rotateLogFile = (logObj) => {
  // 检查日志文件大小是否超过限制
  const logFileSize = getLogFileSize(logObj.file);
  if (logFileSize < logObj.rotateSize) {
    // 未超过限制，返回
    return;
  }

  const backupDir = logConfig.backupPath;
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  // 文件名拼接
  const dateTime = new Date().toISOString().replace(/[^\d]/g, '');
  const newFileName = path.join(backupDir, `${logObj.type}.${dateTime}.${logConfig.logExtension}`);
  // 移动至备份文件夹
  fs.renameSync(logObj.file, newFileName);

  // 限制备份日志个数
  // 获取日志备份文件夹中的所有文件列表
  const files = fs.readdirSync(logConfig.backupPath);
  // 过滤获取对应类型日志列表
  const logList = files.filter((filename) => getLogTypeFromFileName(filename) === logObj.type);
  // 排序，确保最新的日志备份排在最前面
  logList.sort((a, b) => {
    const timeA = getTimeFromFileName(a);
    const timeB = getTimeFromFileName(b);
    return timeB - timeA; // 降序排列
  });
  // 删除多余的日志
  deleteExcessBackups(logList, logObj.backupMaxNum);
};

// 记录日志
const log = (logFile, data) => {
  // 创建日志文件夹（如果不存在）
  if (!fs.existsSync(logConfig.logPath)) {
    fs.mkdirSync(logConfig.logPath);
  }
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
    // 日志数据
    const logData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userId: req.user?.id || null,
      statusCode: res.statusCode,
      info,
    };
    log(logConfig.web.file, logData);
    // 切割日志
    rotateLogFile(logConfig.web);
  } catch (error) {
    console.error('logWeb: ', error);
  }
};

// 记录管理员日志
const logAdmin = (req, res, info = null) => {
  try {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      statusCode: res.statusCode,
      info,
    };
    log(logConfig.admin.file, logData);
    rotateLogFile(logConfig.admin);
  } catch (error) {
    console.error('logAdmin: ', error);
  }
};

module.exports = {
  logWeb,
  // logUser,
  logAdmin,
};
