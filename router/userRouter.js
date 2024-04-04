const express = require('express');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');
// 导入解析 formdata 格式表单数据的包
const multer = require('multer');

// 导入配置文件
const { avatarConfig } = require('../config');
// 导入数据库处理函数
const userHandler = require('../router_handler/userHandler');
// 导入需要的验证规则对象
const {
  updateProfileSchema,
  updateEmailSchema,
  updatePasswordSchema,
  updateE5infoSchema,
} = require('../schema/userSchema');

// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const avatarUpload = multer({ dest: avatarConfig.uploadPath });

// 创建路由对象
const router = express.Router();

// 获取个人信息
router.get('/profile', userHandler.getProfile);

// 修改基本信息
router.patch('/profile', expressJoi(updateProfileSchema), userHandler.updateProfile);
router.put('/avatar', avatarUpload.single('avatar'), userHandler.updateAvatar);
router.put('/email', expressJoi(updateEmailSchema), userHandler.updateEmail);
router.put('/password', expressJoi(updatePasswordSchema), userHandler.updatePassword);
router.put('/e5info', expressJoi(updateE5infoSchema), userHandler.updateE5info);
// 清空通知
router.delete('/notifications', userHandler.clearNotif);

// 将路由对象共享出去
module.exports = router;
