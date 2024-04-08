// 导入处理路径的核心模块
const path = require('path');

const dbName = 'database.sqlite';
const dbPath = path.join(__dirname, 'db/');

// 数据库配置
exports.dbConfig = {
  dsl: 'sqlite', // 使用的数据库类型
  dbName, // 数据库名
  dbPath, // 数据库保存路径
  dbfile: path.join(dbPath, dbName), // 数据库文件路径
  backupPath: path.join(dbPath, 'backups/'), // 数据库备份文件保存路径
  backupType: { // 备份类型
    StartupBackup: 'StartupBackup',
    DailyBackup: 'DailyBackup',
    MonthlyBackup: 'MonthlyBackup',
  },
  backupMaxNum: { // 备份最大数量
    StartupBackup: 5,
    DailyBackup: 5,
    MonthlyBackup: 99,
  },
  backupCron: { // 备份频率Cron表达式，注意：UTC时间
    DailyBackup: '0 1 * * *', // 每天凌晨1点执行
    MonthlyBackup: '1 1 1 * *', // 每月1号凌晨1点1分执行
  },
};

// jwt 配置
exports.jwtConfig = {
  secretKey: 'test ^_^',
  expiresIn: '120d', // token 有效期为 90天
};

// 头像配置
exports.avatarConfig = {
  uploadPath: path.join(__dirname, 'uploads/'), // 上传时的临时保存路径
  savePath: path.join(__dirname, 'uploads/avatar/'), // 处理后的保存路径
  size: 256, // 图片大小
  quality: 64, // 图片质量
};

// 用户状态配置
const accountStatus = {
  active: 'active',
  banned: 'banned',
  sharing: 'sharing',
};
exports.accountStatus = accountStatus;

// 分享信息状态
const shareInfoStatus = {
  unsent: 'unsent',
  pending_confirmation: 'pending_confirmation',
  confirmed: 'confirmed',
  stoped: 'stoped',
};

// e5分享相关配置
exports.e5shareConfig = {
  // 允许用户登记的状态 数组
  allowRegistrationStatus: [accountStatus.active],
  // 分享信息状态
  shareInfoStatus,
  // 分享信息不能删除的状态：已确认后不能删除
  shareInfoCantDelStatus: [shareInfoStatus.confirmed],
};

// 通知类型
exports.notificationType = {
  // 系统通知
  system: 'system',
  // 其他通知
  other: 'other',
  // e5分享申请通知
  e5_share_application: 'e5_share_application',
  // e5分享确认通知
  e5_share_confirmation: 'e5_share_confirmation',
  // e5分享完成通知
  e5_share_completion: 'e5_share_completion',
  // e5分享注销通知
  e5_share_closure: 'e5_share_closure',
  // e5账号分享者停止分享通知
  e5_share_sharer_stop: 'e5_share_sharer_stop',
  // e5账号接受者停止分享通知
  e5_share_receiver_stop: 'e5_share_receiver_stop',
};

// 管理员联系方式
exports.adminContact = 'X/Twitter: @harukiO_0';

// 日志配置
const logPath = path.join(__dirname, 'logs/');
const logExtension = 'log'; // 日志后缀名

// web日志
const webLogType = 'web';
const webLogName = `${webLogType}.${logExtension}`;
const webLogFile = path.join(logPath, webLogName);
// // 用户日志
// const userLogType = 'user';
// const userLogName = `${userLogType}.${logExtension}`;
// const userLogFile = path.join(logPath, userLogName);
// 管理日志
const adminLogType = 'admin';
const adminLogName = `${adminLogType}.${logExtension}`;
const adminLogFile = path.join(logPath, adminLogName);

exports.logConfig = {
  logPath,
  logExtension,

  // 日志切割后的保存路径
  backupPath: path.join(logPath, 'backups/'),
  web: {
    type: webLogType,
    name: webLogName,
    file: webLogFile,
    // 日志切割大小 10MB
    rotateSize: 10 * 1024 * 1024,
    // 最大备份个数
    backupMaxNum: 5,
  },
  // user: {
  //   type: userLogType,
  //   name: userLogName,
  //   file: userLogFile,
  // },
  admin: {
    type: adminLogType,
    name: adminLogName,
    file: adminLogFile,
    // 日志切割大小 10MB
    rotateSize: 10 * 1024 * 1024,
    // 最大备份个数
    backupMaxNum: 5,
  },
};
