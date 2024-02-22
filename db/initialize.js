const { sequelize } = require('./index');
const { User } = require('../models/index');

// 数据库初始化函数
const initializeDatabase = async () => {
  try {
    // 在这里执行数据库初始化操作，例如创建表格、插入初始数据等
    await sequelize.sync();

    // 检查是否数据库中已经存在数据
    const usersCount = await User.count();
    if (usersCount === 0) {
      // 执行初始化内容，例如创建初始用户
      await User.create({
        username: 'admin',
        password_hash: 'hashed_password',
        email: 'admin@example.com',
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
