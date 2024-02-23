const { Sequelize } = require('sequelize');
const path = require('path');

// 配置 SQLite 数据库
const dbConfig = {
  dsl: 'sqlite', // 使用的数据库类型
  dbfile: path.join(__dirname, 'database.sqlite'), // 数据库文件路径
};

// 创建 Sequelize 实例并连接数据库
const sequelize = new Sequelize({
  dialect: dbConfig.dsl,
  storage: dbConfig.dbfile,
  logging: false, // 设置为 false 以禁用日志记录
});

// 导出 dbConfig 与 Sequelize 实例
module.exports = {
  dbConfig,
  sequelize,
};
