const { sequelize } = require('./index');

// 数据库初始化函数
const initializeDatabase = async () => {
  // 在这里执行数据库初始化操作，例如创建表格、插入初始数据等
  await sequelize.sync();
};

module.exports = {
  initializeDatabase,
};
