// 导入处理路径的核心模块
const path = require('path');

// 数据库配置
exports.dbConfig = {
  dsl: 'sqlite', // 使用的数据库类型
  dbfile: path.join(__dirname, './db/database.sqlite'), // 数据库文件路径
};

// jwt 配置
exports.jwtConfig = {
  secretKey: 'test ^_^',
  expiresIn: '120d', // token 有效期为 90天
};

// 头像配置
exports.avatarConfig = {
  uploadPath: path.join(__dirname, './uploads'), // 上传时的临时保存路径
  savePath: path.join(__dirname, './uploads/avatar'), // 处理后的保存路径
  size: 256, // 图片大小
  quality: 64, // 图片质量
};

// 用户状态配置
const status = {
  active: 'active',
  banned: 'banned',
  sharing: 'sharing',
};
exports.accountStatusConfig = status;

// e5分享相关配置
exports.e5shareConfig = {
  // 允许用户登记的状态 数组
  allowRegistrationStatus: [status.active],
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
