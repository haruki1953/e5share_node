// 用于生成uuid
const { v4: uuidv4 } = require('uuid');
// 用于操作数据库的模型
// const { UserNotification } = require('../models/index');
// 自定义错误对象
// const { ClientError, ServerError } = require('./errors/index');

// 数据模块
const {
  getNotifications,
  saveNotifications,
} = require('./dataService');
// 配置文件
const { notificationType } = require('../config');

// 清空通知服务函数
const clearNotification = async (userId) => {
  // 保存空数组
  await saveNotifications(userId, []);
};

// 发送通知操作
async function sendNotification(userId, type, content, otherInfo = {}) {
  // 获取用户通知
  const notifications = await getNotifications(userId);

  // 定义新通知对象
  const newNotif = {
    id: uuidv4(),
    type,
    content,
    time: new Date(),
    otherInfo,
  };
  // 添加通知
  notifications.push(newNotif);

  // 保存
  await saveNotifications(userId, notifications);

  // 返回新创建的通知
  return newNotif;
}

// 发送e5分享注销通知
async function sendE5ShareClosureNotification(userId, content, e5id) {
  return sendNotification(
    userId,
    notificationType.e5_share_closure,
    content,
    { otherUserId: e5id },
  );
}

// 发送e5分享申请通知
async function sendE5ShareApplicationNotification(e5id, content, userId) {
  return sendNotification(
    e5id,
    notificationType.e5_share_application,
    content,
    { otherUserId: userId },
  );
}

// 发送e5分享确认通知
async function sendE5ShareConfirmationNotification(userId, content, e5id) {
  return sendNotification(
    userId,
    notificationType.e5_share_confirmation,
    content,
    { otherUserId: e5id },
  );
}

// 发送e5分享完成通知
async function sendE5ShareCompletionNotification(e5id, content, userId) {
  return sendNotification(
    e5id,
    notificationType.e5_share_completion,
    content,
    { otherUserId: userId },
  );
}

// 发送e5账号分享者停止分享通知
async function sendE5ShareSharerStopNotification(userId, content, e5id) {
  return sendNotification(
    userId,
    notificationType.e5_share_sharer_stop,
    content,
    { otherUserId: e5id },
  );
}

// 发送e5账号接受者停止分享通知
async function sendE5ShareReceiverStopNotification(e5id, content, userId) {
  return sendNotification(
    e5id,
    notificationType.e5_share_receiver_stop,
    content,
    { otherUserId: userId },
  );
}

module.exports = {
  clearNotification,
  sendE5ShareClosureNotification,
  sendE5ShareApplicationNotification,
  sendE5ShareConfirmationNotification,
  sendE5ShareCompletionNotification,
  sendE5ShareSharerStopNotification,
  sendE5ShareReceiverStopNotification,
};
