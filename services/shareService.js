// 用于生成uuid
// const { v4: uuidv4 } = require('uuid');

// Sequelize 实例
const { sequelize } = require('../db/index');
// 用于操作数据库的模型
const { UsersE5SharedInfo } = require('../models/index');
// 自定义错误对象
const { ClientError, ServerError } = require('./errors/index');
// 已定义的业务操作
const { findOneUserById, updateE5info } = require('./userService');
const { findE5PostById } = require('./postService');
const { sendE5ShareClosureNotification } = require('./notificationService');
// 配置文件
const { e5shareConfig, accountStatusConfig } = require('../config');

// 通过user_id获取UsersE5SharedInfo
async function findE5SharedInfoById(id) {
  const sharedInfo = await UsersE5SharedInfo.findOne({
    where: { user_id: id },
  });
  // 未找到则抛出错误
  if (!sharedInfo) {
    throw new ClientError('用户不存在');
  }
  return sharedInfo;
}

// 确认当前状态可以进行登记分享
async function confirmStatusCanRegistration(id) {
  const user = await findOneUserById(id);
  if (!e5shareConfig.allowRegistrationStatus.includes(user.account_status)) {
    if (user.account_status === accountStatusConfig.sharing) throw new ClientError('状态已为正在分享');
    throw new ClientError('当前用户状态不能登记分享');
  }
}

// 修改状态并重置e5相关信息
async function modifyStatusAndResetE5Info(id, status) {
  // 获取用户
  const user = await findOneUserById(id);
  // 设置用户状态
  user.account_status = status;
  // helping_users 字段清空
  user.helping_users = '[]';

  // 获取动态，清空
  const e5Post = await findE5PostById(id);
  e5Post.posts = '[]';
  // 获取分享信息，清空
  const sharedInfo = await findE5SharedInfoById(id);
  sharedInfo.shared_info = '[]';

  // 使用事务保存信息
  let transaction;
  try {
    // 开启事务
    transaction = await sequelize.transaction();

    await user.save({ transaction });
    await e5Post.save({ transaction });
    await sharedInfo.save({ transaction });

    // 提交事务
    await transaction.commit();
  } catch (error) {
    // 出错则回滚事务
    if (transaction) await transaction.rollback();
    throw new ServerError('保存失败');
  }
}

// 登记分享
async function registerShare(id, subscriptionDate, expirationDate) {
  // 确认当前状态可以进行登记分享
  await confirmStatusCanRegistration(id);

  // 调用已有服务 设置e5开始时间与到期时间
  await updateE5info(id, subscriptionDate, expirationDate);

  // 修改状态并重置e5相关信息
  await modifyStatusAndResetE5Info(id, accountStatusConfig.sharing);
}

// 确认状态为正在分享
async function confirmStatusIsSharing(id) {
  const user = await findOneUserById(id);
  if (user.account_status !== accountStatusConfig.sharing) {
    throw new ClientError('当前状态非正在分享');
  }
}

// 从帮助用户的 helping_by_users 字段中删除e5帐号主的用户id
async function removeUserFromHelpedByUsers(userId, e5id) {
  const user = await findOneUserById(userId);
  let helpingByUsers;
  try {
    // 从字符串解析为帖子对象数组
    helpingByUsers = JSON.parse(user.helping_by_users);
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('helping_by_users列表损坏');
  }

  // 从 helpingByUsers 数组中过滤掉 e5id
  helpingByUsers = helpingByUsers.filter((id) => id !== e5id);

  try {
    // 更新数据
    user.helping_by_users = JSON.stringify(helpingByUsers);
    await user.save();
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('helping_by_users修改失败');
  }
}

// 注销分享
async function cancelShare(id, message) {
  // 确认状态为正在分享
  await confirmStatusIsSharing(id);

  /* 解除与其他用户的分享 */
  // 获取e5帐号主正在帮助的用户id
  const user = await findOneUserById(id);
  let helpingUsersIds;
  try {
    helpingUsersIds = JSON.parse(user.helping_users);
  } catch (error) {
  // 如果发生错误，抛出客户端错误
    throw new ServerError('helping_users列表损坏');
  }
  try {
    // 构造一个包含所有异步操作的 Promise 数组
    const promises = helpingUsersIds.map(async (helpingUserId) => {
      await sendE5ShareClosureNotification(helpingUserId, message, id);
      await removeUserFromHelpedByUsers(helpingUserId, id);
    });
    // 等待所有异步操作完成
    await Promise.all(promises);
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('修改失败');
  }

  // 修改状态并重置e5相关信息
  await modifyStatusAndResetE5Info(id, accountStatusConfig.active);
}

module.exports = {
  registerShare,
  cancelShare,
};
