const { Sequelize } = require('sequelize');
const { dbConfig } = require('../config');

// 创建 Sequelize 实例并连接数据库
const sequelize = new Sequelize({
  dialect: dbConfig.dsl,
  storage: dbConfig.dbfile,
  logging: false, // 设置为 false 以禁用日志记录
});

// 导出 Sequelize 实例
module.exports = {
  sequelize,
};
