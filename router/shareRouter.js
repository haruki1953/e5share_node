const express = require('express');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

// 导入数据库处理函数
const shareHandler = require('../router_handler/shareHandler');

// 导入需要的验证规则对象
const {
  registerShareSchema,
  cancelShareSchema,
} = require('../schema/shareSchema');

// 创建路由对象
const router = express.Router();

// 登记分享
router.put('/register', expressJoi(registerShareSchema), shareHandler.registerShare);
// 注销分享
router.put('/cancel', expressJoi(cancelShareSchema), shareHandler.cancelShare);

// // 申请
// router.post('/application', shareHandler.sendApplication);
// // 发起确认
// router.put('/confirmation/initiate', shareHandler.initiateConfirmation);
// // 接受确认
// router.put('/confirmation/accept', shareHandler.acceptConfirmation);
// // 停止用户分享
// router.put('/stop/sharing', shareHandler.cancelShareing);
// // 停止接受分享
// router.put('/stop/receiving', shareHandler.cancelReceiving);

// // 获取分享信息
// router.get('/info', shareHandler.getShareinfo);
// // 添加分享信息
// router.post('/info', shareHandler.addShareinfo);
// // 修改分享信息
// router.patch('/info', shareHandler.updateShareinfo);
// // 删除分享信息
// router.delete('/info', shareHandler.deleteShareinfo);

// 将路由对象共享出去
module.exports = router;
