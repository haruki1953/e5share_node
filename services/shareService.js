// 用于生成uuid
const { v4: uuidv4 } = require('uuid');
// 自定义错误对象
const { ClientError, ServerError } = require('./errors/index');
// 数据模块
const {
  findOneUserById,
  getHelpingByUsers,
  saveHelpingByUsers,
  getHelpingUsers,
  saveHelpingUsers,
  getShareInfo,
  saveShareInfo,
  savePosts,
  getHelpedByUsers,
  saveHelpedByUsers,
  getHelpedUsers,
  saveHelpedUsers,
} = require('./dataService');
// 已定义的业务操作
const { updateE5info } = require('./userService');
const {
  sendE5ShareClosureNotification,
  sendE5ShareApplicationNotification,
  sendE5ShareConfirmationNotification,
  sendE5ShareCompletionNotification,
  sendE5ShareSharerStopNotification,
  sendE5ShareReceiverStopNotification,
} = require('./notificationService');
// 配置文件
const {
  e5shareConfig: {
    allowRegistrationStatus,
    shareInfoStatus,
    shareInfoCantDelStatus,
  },
  accountStatus,
} = require('../config');

// 确认当前状态可以进行登记分享
async function confirmStatusCanRegistration(id) {
  const user = await findOneUserById(id);
  if (!allowRegistrationStatus.includes(user.account_status)) {
    if (user.account_status === accountStatus.sharing) throw new ClientError('状态已为正在分享');
    throw new ClientError('当前用户状态不能登记分享');
  }
}

// 修改状态并重置e5相关信息
async function modifyStatusAndResetE5Info(id, status) {
  // 获取用户
  const user = await findOneUserById(id);
  // 设置用户状态
  user.account_status = status;
  try {
    await user.save();
  } catch (error) {
    throw new ServerError('保存失败');
  }

  // helping_users 字段清空
  await saveHelpingUsers(id, []);
  // 动态清空
  await savePosts(id, []);
  // 获取分享信息，清空
  await saveShareInfo(id, []);
}

// 登记分享
async function registerShare(id, subscriptionDate, expirationDate) {
  // 确认当前状态可以进行登记分享
  await confirmStatusCanRegistration(id);

  // 调用已有服务 设置e5开始时间与到期时间
  await updateE5info(id, subscriptionDate, expirationDate);

  // 修改状态并重置e5相关信息
  await modifyStatusAndResetE5Info(id, accountStatus.sharing);
}

// 确认状态为正在分享
async function confirmStatusIsSharing(id) {
  const user = await findOneUserById(id);
  if (user.account_status !== accountStatus.sharing) {
    throw new ClientError('当前状态非正在分享');
  }
}

// 从帮助用户的 helping_by_users 字段中删除e5帐号主的用户id
async function removeUserFromHelpedByUsers(userId, e5id) {
  let helpingByUsers = await getHelpingByUsers(userId);

  // 从 helpingByUsers 数组中过滤掉 e5id
  helpingByUsers = helpingByUsers.filter((id) => id !== e5id);

  await saveHelpingByUsers(userId, helpingByUsers);
}

// 注销分享
async function cancelShare(id, message) {
  // 确认状态为正在分享
  await confirmStatusIsSharing(id);

  /* 解除与其他用户的分享 */
  // 获取e5帐号主正在帮助的用户id
  const helpingUsersIds = await getHelpingUsers(id);
  try {
    // 构造一个包含所有异步操作的 Promise 数组
    const promises = helpingUsersIds.map(async (helpingUserId) => {
      try {
        // 从帮助用户的 helping_by_users 字段中删除e5帐号主的用户id
        await removeUserFromHelpedByUsers(helpingUserId, id);
        // 发送e5分享注销通知
        await sendE5ShareClosureNotification(helpingUserId, message, id);
      } catch (error) {
        console.log(error);
      }
    });
    // 等待所有异步操作完成
    await Promise.all(promises);
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('修改失败');
  }

  // 修改状态并重置e5相关信息
  await modifyStatusAndResetE5Info(id, accountStatus.active);
}

// 确认用户未被当前e5帐号主帮助
async function confirmUserNotHelpedByE5Owner(userId, e5id) {
  // 获取 helping_by_users
  const helpingByUsers = await getHelpingByUsers(userId);
  // 如果包含e5id则抛出错误
  if (helpingByUsers.includes(e5id)) {
    throw new ClientError('已接受分享');
  }
}

// 申请分享
async function sendApplication(id, e5id, message) {
  if (id === e5id) {
    throw new ClientError('不能向自己申请');
  }
  // 确认e5帐号主状态为正在分享
  await confirmStatusIsSharing(e5id);
  // 确认自己是否正在被帮助（不能重复申请）
  await confirmUserNotHelpedByE5Owner(id, e5id);
  // 发送 e5分享申请通知
  const newNotif = await sendE5ShareApplicationNotification(e5id, message, id);
  // 返回发送的通知
  return newNotif;
}

// 获取分享信息
async function getE5ShareInfo(id) {
  return getShareInfo(id);
}

// 确认用户不存在于分享信息
function confirmUserNotInShareInfo(shareInfoArray, userId) {
  // 使用 Array.prototype.find() 方法查找数组中是否存在具有特定 userId 的对象
  const foundItem = shareInfoArray.find((item) => item.userId === userId);
  // 如果找到了匹配的对象，则抛出错误
  if (foundItem) {
    throw new ClientError(`用户 ${userId} 已经存在于分享信息中`);
  }
}

// 添加分享信息
async function addE5ShareInfo(id, userId, note) {
  if (id === userId) {
    throw new ClientError('不能添加自己');
  }
  // 确认状态为正在分享
  await confirmStatusIsSharing(id);
  // 获取目标用户（确认其存在）
  await findOneUserById(userId);

  // 获取分享信息
  const sharedInfo = await getShareInfo(id);
  // 确认用户不存在于分享信息
  confirmUserNotInShareInfo(sharedInfo, userId);

  // 新建分享信息对象
  const infoObj = {
    id: uuidv4(),
    userId,
    note,
    status: shareInfoStatus.unsent, // 状态（未发送）
    time: new Date(),
  };
  // 添加
  sharedInfo.push(infoObj);
  // 保存
  await saveShareInfo(id, sharedInfo);
  // 返回新添加的分享信息
  return infoObj;
}

function findSharedInfoIndexByUserId(sharedInfo, userId) {
  // 找到具有相应 userId 的对象的索引
  const targetIndex = sharedInfo.findIndex((info) => info.userId === userId);
  // 如果未找到目标对象，则抛出异常
  if (targetIndex === -1) {
    throw new ClientError(`用户 ${userId} 的分享信息不存在`);
  }
  return targetIndex;
}

// 修改分享信息（修改备注）
async function updateE5ShareInfo(id, userId, note) {
  // 获取分享信息
  const sharedInfo = await getShareInfo(id);

  // 找到具有相应 userId 的对象的索引
  const targetIndex = findSharedInfoIndexByUserId(sharedInfo, userId);

  // 修改其备注
  sharedInfo[targetIndex].note = note;

  // 保存修改后的分享信息
  await saveShareInfo(id, sharedInfo);
  // 返回被修改的分享信息
  return sharedInfo[targetIndex];
}

// 删除分享信息
async function deleteE5ShareInfo(id, userId) {
  // 获取分享信息
  const sharedInfo = await getShareInfo(id);

  // 找到具有相应 userId 的对象的索引
  const targetIndex = findSharedInfoIndexByUserId(sharedInfo, userId);

  // 状态为已确认等不能删除的状态时抛出错误
  if (shareInfoCantDelStatus.includes(sharedInfo[targetIndex].status)) {
    throw new ClientError(`当前状态为 ${sharedInfo[targetIndex].status} 不能进行删除`);
  }

  // 从数组中删除目标对象
  sharedInfo.splice(targetIndex, 1);

  // 保存删除后的分享信息
  await saveShareInfo(id, sharedInfo);
}

// 发送分享确认
async function sendConfirmation(id, userId, message) {
  // 获取分享信息
  const sharedInfo = await getShareInfo(id);

  // 找到具有相应 userId 的对象的索引
  const targetIndex = findSharedInfoIndexByUserId(sharedInfo, userId);

  // 确认分享信息为未发送
  if (sharedInfo[targetIndex].status !== shareInfoStatus.unsent) {
    throw new ClientError(
      `当前状态为 ${sharedInfo[targetIndex].status} ，仅在状态为 unsent 时可以发送确认`,
    );
  }
  // 分享信息状态改为待确认
  sharedInfo[targetIndex].status = shareInfoStatus.pending_confirmation;

  // 保存修改后的分享信息
  await saveShareInfo(id, sharedInfo);

  // 给 接受方用户，发送 e5分享确认通知
  const newNotif = await sendE5ShareConfirmationNotification(userId, message, id);
  return newNotif;
}

// 接受分享确认
async function acceptConfirmation(id, e5id, message) {
  /* 获取分享信息 */
  const sharedInfo = await getShareInfo(e5id);
  // 找到具有相应 userId 的对象的索引
  const targetIndex = findSharedInfoIndexByUserId(sharedInfo, id);
  // 确认分享信息为待确认
  if (sharedInfo[targetIndex].status !== shareInfoStatus.pending_confirmation) {
    throw new ClientError('对方还未发送分享确认');
  }
  // 分享信息状态改为已确认
  sharedInfo[targetIndex].status = shareInfoStatus.confirmed;

  /* 关联操作 */
  // 获取e5账号主的 helping_users，并添加用户id
  const e5OwnerHelpingUsers = await getHelpingUsers(e5id);
  e5OwnerHelpingUsers.push(id);
  // 获取e5账号主的 helped_users，并添加用户id
  const e5OwnerHelpedUsers = await getHelpedUsers(e5id);
  e5OwnerHelpedUsers.push(id);

  // 获取用户的 helping_by_users，并添加e5id
  const userHelpingByUsers = await getHelpingByUsers(id);
  userHelpingByUsers.push(e5id);
  // 获取用户的 helped_by_users，并添加e5id
  const userHelpedByUsers = await getHelpedByUsers(id);
  userHelpedByUsers.push(e5id);

  // 统一保存信息
  await saveShareInfo(e5id, sharedInfo);
  await saveHelpingUsers(e5id, e5OwnerHelpingUsers);
  await saveHelpedUsers(e5id, e5OwnerHelpedUsers);
  await saveHelpingByUsers(id, userHelpingByUsers);
  await saveHelpedByUsers(id, userHelpedByUsers);

  // 给e5账号主发送 e5分享完成通知，并返回
  const newNotif = await sendE5ShareCompletionNotification(e5id, message, id);
  return newNotif;
}

// 封装停止分享操作
async function stopShareWithE5AndUser(e5id, userId) {
  /* 获取分享信息 */
  const sharedInfo = await getShareInfo(e5id);
  // 找到具有相应 userId 的对象的索引
  const targetIndex = findSharedInfoIndexByUserId(sharedInfo, userId);
  // 确认分享信息为已确认
  if (sharedInfo[targetIndex].status !== shareInfoStatus.confirmed) {
    throw new ClientError('状态非 confirmed 无法停止分享');
  }
  // 分享信息状态改为已停止
  sharedInfo[targetIndex].status = shareInfoStatus.stoped;

  /* 取消关联操作 */
  // 获取e5账号主的 helping_users，并移除用户id
  let e5OwnerHelpingUsers = await getHelpingUsers(e5id);
  e5OwnerHelpingUsers = e5OwnerHelpingUsers.filter((idNum) => idNum !== userId);
  // 获取用户的 helping_by_users，并移除e5id
  let userHelpingByUsers = await getHelpingByUsers(userId);
  userHelpingByUsers = userHelpingByUsers.filter((idNum) => idNum !== e5id);

  // 统一保存信息
  await saveShareInfo(e5id, sharedInfo);
  await saveHelpingUsers(e5id, e5OwnerHelpingUsers);
  await saveHelpingByUsers(userId, userHelpingByUsers);
}

// e5账号主停止对用户的分享
async function stopSharing(id, userId, message) {
  // 停止分享操作
  await stopShareWithE5AndUser(id, userId);
  // 给用户发送 e5账号分享者停止分享通知，并返回
  const newNotif = await sendE5ShareSharerStopNotification(userId, message, id);
  return newNotif;
}

// 用户停止接受e5账号主的分享
async function stopReceiving(id, e5id, message) {
  // 停止分享操作
  await stopShareWithE5AndUser(e5id, id);
  // 给e5帐号主发送 e5账号接受者停止分享通知，并返回
  const newNotif = await sendE5ShareReceiverStopNotification(e5id, message, id);
  return newNotif;
}

module.exports = {
  registerShare,
  cancelShare,
  sendApplication,
  getE5ShareInfo,
  addE5ShareInfo,
  updateE5ShareInfo,
  deleteE5ShareInfo,
  sendConfirmation,
  acceptConfirmation,
  stopSharing,
  stopReceiving,
};
