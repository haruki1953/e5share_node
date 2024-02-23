const express = require('express');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

// 导入数据库处理函数
const authHandler = require('../router_handler/authHandler');

// 导入需要的验证规则对象
const { regUserSchema } = require('../schema/userSchema');

// 创建路由对象
const router = express.Router();

// 注册新用户
router.post('/register', expressJoi(regUserSchema), authHandler.register);
// 登录
router.post('/login', authHandler.login);

// 将路由对象共享出去
module.exports = router;
