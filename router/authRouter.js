const express = require('express');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

// 导入数据库处理函数
const authHandler = require('../router_handler/authHandler');

// 导入需要的验证规则对象
const {
  regUserSchema,
  loginByUsernameSchema,
  loginByEmailSchema,
} = require('../schema/userSchema');

// 创建路由对象
const router = express.Router();

// 注册新用户
router.post('/register', expressJoi(regUserSchema), authHandler.register);
// 用户名登录与邮箱登录
router.post('/login/username', expressJoi(loginByUsernameSchema), authHandler.loginByUsername);
router.post('/login/email', expressJoi(loginByEmailSchema), authHandler.loginByEmail);

// 将路由对象共享出去
module.exports = router;
