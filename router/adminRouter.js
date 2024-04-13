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
const {
  loginAdminSchema,
  updateAdminSchema,
  updateAuthSchema,
  registerUserSchema,
  updateUserPasswordSchema,
  deleteUserSchema,
} = require('../schema/adminSchema');

// 创建路由对象
const router = express.Router();

// 设置 expressJWT 中间件，排除 /login
router.use(expressJWT({ secret: jwtAdmin.secretKey })
  .unless({ path: [/\/login$/] }));

router.post('/login', expressJoi(loginAdminSchema), adminHandler.loginAdmin);
router.get('/', adminHandler.getAdmin);
router.put('/', expressJoi(updateAdminSchema), adminHandler.updateAdmin);
router.put('/auth', expressJoi(updateAuthSchema), adminHandler.updateAuth);

router.get('/users', adminHandler.getUsers);
router.post('/user/register', expressJoi(registerUserSchema), adminHandler.registerUser);
router.put('/user/password', expressJoi(updateUserPasswordSchema), adminHandler.updateUserPassword);
router.delete('/user/:userId', expressJoi(deleteUserSchema), adminHandler.deleteUser);

// 将路由对象共享出去
module.exports = router;
