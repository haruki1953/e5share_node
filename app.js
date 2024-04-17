// 导入 express 模块
const express = require('express');
// 数据验证
const joi = require('joi');
// 导入 cors 中间件
const cors = require('cors');
// 解析 token 的中间件
const expressJWT = require('express-jwt');

// 导入配置文件
const { jwtConfig, avatarConfig, adminContact } = require('./config');

// 导入登陆注册路由模块
const authRouter = require('./router/authRouter');
// 导入用户路由模块
const userRouter = require('./router/userRouter');
// 导入公共接口路由模块
const publicRouter = require('./router/publicRouter');
// 导入e5动态路由模块
const postRouter = require('./router/postRouter');
// 导入e5分享路由模块
const shareRouter = require('./router/shareRouter');
// 导入管理模块
const adminRouter = require('./router/adminRouter');

// 创建 express 的服务器实例
const app = express();

// 将 cors 注册为全局中间件
app.use(cors());
// 解析 JSON 格式的请求体数据
app.use(express.json());
// 设置 expressJWT 中间件，除了 /auth /public /static /admin 开头的路径需要 token 认证
app.use(expressJWT({ secret: jwtConfig.secretKey })
  .unless({ path: [/^\/auth/, /^\/public/, /^\/static/, /^\/admin/] }));

// 托管静态资源文件 记得排除鉴权
app.use('/static/avatar', express.static(avatarConfig.savePath, {
  maxAge: avatarConfig.cacheMaxAge, // 设置缓存一年 '1y'
}));

// 注册登录路由模块
app.use('/auth', authRouter);
// 用户路由模块
app.use('/user', userRouter);
// 公共接口路由模块
app.use('/public', publicRouter);
// e5动态路由模块
app.use('/e5post', postRouter);
// e5分享路由模块
app.use('/e5share', shareRouter);
// 管理模块
app.use('/admin', adminRouter);

const { logWarn, logError } = require('./utils/logger');
/** * 全局错误中间件** */
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // 数据验证失败的错误
  if (err instanceof joi.ValidationError) {
    const message = '请求参数格式错误';
    res.status(400).json({
      code: 1,
      message,
    });
    return logWarn(
      err,
      { file: 'app.js', method: 'Global Error Handling Middleware: ValidationError', message },
      req,
      res,
    );
  }
  // 身份认证失败的错误
  if (err.name === 'UnauthorizedError') {
    const message = '身份认证失败！';
    res.status(401).json({
      code: 1,
      message,
    });
    return logWarn(
      err,
      { file: 'app.js', method: 'Global Error Handling Middleware: UnauthorizedError', message },
      req,
      res,
    );
  }

  // 未知错误
  const message = `发生未知错误，请联系管理员 ${adminContact}`;
  res.status(500).json({
    code: 1,
    message,
  });
  return logError(
    err,
    { file: 'app.js', method: 'Global Error Handling Middleware', message },
    req,
    res,
  );
});

// 导入数据库初始化函数
const { initializeDatabase } = require('./db/initialize');
const { startBackupSystem } = require('./db/backup');
// 启动服务器前初始化数据库
(async () => {
  // 启动数据库备份系统
  await startBackupSystem();
  // 初始化数据库
  await initializeDatabase();

  const port = process.env.E5SHARE_NODE_PORT || 23769;
  // 调用 app.listen 方法，指定端口号并启动web服务器
  app.listen(port, () => {
    console.log(`api server running at http://127.0.0.1:${port}`);
  });
})();
