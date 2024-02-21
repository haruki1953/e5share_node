const { Sequelize } = require('sequelize');

// 创建 Sequelize 实例
const sequelize = new Sequelize({
  dialect: 'sqlite', // 使用的数据库类型
  storage: './db/database.sqlite', // 数据库文件路径
});

// 定义 User 模型
const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});

module.exports = {
  sequelize,
  User,
};
