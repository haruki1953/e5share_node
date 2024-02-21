const express = require('express');

const authHandler = require('../router_handler/authHandler');

// 创建路由对象
const router = express.Router();

// 注册新用户
router.post('/register', authHandler.register);
// 登录
router.post('/login', authHandler.login);

// 将路由对象共享出去
module.exports = router;
