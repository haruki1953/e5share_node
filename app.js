// 导入 express 模块
const express = require('express');
// 数据验证
const joi = require('joi');
// 导入 cors 中间件
const cors = require('cors');
// 导入登陆注册路由模块
const authRouter = require('./router/authRouter');

// 创建 express 的服务器实例
const app = express();

// 将 cors 注册为全局中间件
app.use(cors());
// 解析 JSON 格式的请求体数据
app.use(express.json());
// 注册登录路由模块
app.use('/auth', authRouter);

/** * 全局错误中间件** */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // 数据验证失败的错误
  if (err instanceof joi.ValidationError) {
    return res.status(400).json({
      code: 1,
      message: '请求参数格式错误',
    });
  }
  // 身份认证失败的错误
  // if (err.name === 'UnauthorizedError') {
  //   return res.status(400).json({
  //     code: 1,
  //     message: '身份认证失败！',
  //   });
  // }

  // 未知错误
  return res.status(500).json({
    code: 1,
    message: '发生未知错误，请联系管理员 X/twitter: @haruki19530615',
  });
});

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
