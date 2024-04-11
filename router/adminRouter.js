const express = require('express');

// 解析 token 的中间件
const expressJWT = require('express-jwt');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

// 导入配置文件
const { jwtAdmin } = require('../config');

// 导入处理函数
const adminHandler = require('../router_handler/adminHandler');

// 导入需要的验证规则对象
const { loginAdminSchema } = require('../schema/adminSchema');

// 创建路由对象
const router = express.Router();

// 设置 expressJWT 中间件，排除 /login
router.use(expressJWT({ secret: jwtAdmin.secretKey })
  .unless({ path: [/\/login$/] }));

router.post('/login', expressJoi(loginAdminSchema), adminHandler.loginAdmin);
router.get('/', adminHandler.getAdmin);
// router.put('/', adminHandler.updateAdmin);
// router.delete('/user', adminHandler.deleteUser);
// router.post('/notification', adminHandler.sendNotif);

// 将路由对象共享出去
module.exports = router;
