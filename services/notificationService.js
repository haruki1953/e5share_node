// 用于生成uuid
const { v4: uuidv4 } = require('uuid');
// 用于操作数据库的模型
const { UserNotification } = require('../models/index');
// 自定义错误对象
const { ClientError, ServerError } = require('./errors/index');
// 已定义的业务操作
// const { findOneUserById, updateE5info } = require('./userService');
// const { findE5PostById } = require('./postService');
// 配置文件
const { notificationType } = require('../config');

// 获取UserNotification
async function findNotificationById(userId) {
  const userNotification = await UserNotification.findOne({ where: { user_id: userId } });
  if (!userNotification) {
    throw new ClientError('获取用户通知失败');
  }
  return userNotification;
}

// 发送通知操作
async function sendNotification(userId, type, content, otherInfo = {}) {
  // 获取用户通知
  const userNotification = await findNotificationById(userId);
  let notifications;
  try {
    notifications = JSON.parse(userNotification.notifications);
  } catch (error) {
    throw new ServerError('通知列表损坏');
  }

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
  try {
    // 更新数据
    userNotification.notifications = JSON.stringify(notifications);
    await userNotification.save();
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('添加通知失败');
  }
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

module.exports = {
  sendE5ShareClosureNotification,
};
