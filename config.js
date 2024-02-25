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
