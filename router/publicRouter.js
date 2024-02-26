const express = require('express');

// 导入验证表单数据的中间件
// const expressJoi = require('@escook/express-joi');

// 导入数据库处理函数
const publicHandler = require('../router_handler/publicHandler');

// 导入需要的验证规则对象
// const {
//   regUserSchema,
//   loginByUsernameSchema,
//   loginByEmailSchema,
// } = require('../schema/userSchema');

// 创建路由对象
const router = express.Router();

// 获取全部用户信息
router.get('/users', publicHandler.getUsers);

// 将路由对象共享出去
module.exports = router;
