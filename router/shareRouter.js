const express = require('express');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

// 导入数据库处理函数
const shareHandler = require('../router_handler/shareHandler');

// 导入需要的验证规则对象
const {
  registerShareSchema,
  cancelShareSchema,
  sendApplicationSchema,
  addE5ShareInfoSchema,
  updateE5ShareInfoSchema,
  deleteE5ShareInfoSchema,
  sendConfirmationSchema,
  acceptConfirmationSchema,
  stopSharingSchema,
  stopReceivingSchema,
} = require('../schema/shareSchema');

// 创建路由对象
const router = express.Router();

// 登记分享
router.put('/register', expressJoi(registerShareSchema), shareHandler.registerShare);
// 注销分享
router.put('/cancel', expressJoi(cancelShareSchema), shareHandler.cancelShare);

// 申请
router.post('/application', expressJoi(sendApplicationSchema), shareHandler.sendApplication);
// 发送分享确认
router.put('/confirmation/send', expressJoi(sendConfirmationSchema), shareHandler.sendConfirmation);
// 接受分享确认
router.put('/confirmation/accept', expressJoi(acceptConfirmationSchema), shareHandler.acceptConfirmation);
// e5账号主停止对用户的分享
router.put('/stop/sharing', expressJoi(stopSharingSchema), shareHandler.stopSharing);
// 用户停止接受e5账号主的分享
router.put('/stop/receiving', expressJoi(stopReceivingSchema), shareHandler.stopReceiving);

// 获取分享信息
router.get('/info', shareHandler.getE5ShareInfo);
// 添加分享信息
router.post('/info', expressJoi(addE5ShareInfoSchema), shareHandler.addE5ShareInfo);
// 修改分享信息（修改备注）
router.patch('/info', expressJoi(updateE5ShareInfoSchema), shareHandler.updateE5ShareInfo);
// 删除分享信息
router.delete('/info/:userId', expressJoi(deleteE5ShareInfoSchema), shareHandler.deleteE5ShareInfo);

// 将路由对象共享出去
module.exports = router;
