const express = require('express');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

// 导入数据库处理函数
const userHandler = require('../router_handler/userHandler');

// 导入需要的验证规则对象
const {
  updateProfileSchema,
} = require('../schema/userSchema');

// 创建路由对象
const router = express.Router();

// 获取个人信息
router.get('/profile', userHandler.getProfile);

// 修改基本信息
router.patch('/profile', expressJoi(updateProfileSchema), userHandler.updateProfile);
// router.put('/avatar', userHandler.updateAvatar);
// router.put('/password', userHandler.updatePassword);
// router.put('/email', userHandler.updateEmail);
// router.put('/e5-subscription', userHandler.updateE5Subscription);

// 将路由对象共享出去
module.exports = router;
