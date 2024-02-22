// 导入 express 模块
const express = require('express');
// 创建 express 的服务器实例
const app = express();

// 导入 cors 中间件
const cors = require('cors');
// 将 cors 注册为全局中间件
app.use(cors());

// 解析 JSON 格式的请求体数据
app.use(express.json());

// 导入登陆注册路由模块
const authRouter = require('./router/authRouter');
// 注册登录路由模块
app.use('/auth', authRouter);

// write your code here...

// 导入数据库初始化函数
const { initializeDatabase } = require('./db/initialize');
// 启动服务器前初始化数据库
(async () => {
  try {
    // 初始化数据库
    await initializeDatabase();
    console.log('Database initialized successfully');

    // 调用 app.listen 方法，指定端口号并启动web服务器
    app.listen(3007, () => {
      console.log('api server running at http://127.0.0.1:3007');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();
