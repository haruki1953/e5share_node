// 密码加密
const bcrypt = require('bcryptjs');
const { sequelize } = require('./index');
const { Admin } = require('../models/index');

// 数据库初始化函数
const initializeDatabase = async () => {
  try {
    // 在这里执行数据库初始化操作，例如创建表格、插入初始数据等
    await sequelize.sync();

    // 检查是否存在管理员
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      // 执行初始化内容，创建初始管理员用户
      await Admin.create({
        username: 'admin',
        password_hash: bcrypt.hashSync('adminadmin', 10),
        level: 'root',
      });
      console.log('Initial user created successfully');
    } else {
      console.log('Database already contains data, skipping initialization');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = {
  initializeDatabase,
};
