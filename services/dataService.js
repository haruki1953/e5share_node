/*
 * 在此封装查找数据的操作
 * 对于数据库中存储的json字符串，获取与保存比较麻烦，故在此封装
 */
// 自定义错误对象
const { ClientError, ServerError } = require('./errors/index');
// 用于操作数据库的模型
const {
  User,
  UserE5Post,
  UsersE5SharedInfo,
  UserNotification,
} = require('../models/index');
// 已定义的业务操作
// const { findOneUserById } = require('./userService');
// const { findE5PostById } = require('./postService');
// const { findNotificationById } = require('./notificationService');

// 根据id查找用户
async function findOneUserById(id) {
  const user = await User.findByPk(id);
  // 没有则抛出错误
  if (!user) {
    throw new ClientError('用户不存在');
  }
  return user;
}

// 根据用户名查找用户
async function findOneUserByUsername(username) {
  const user = await User.findOne({ where: { username } });
  // 没有则抛出错误
  if (!user) {
    throw new ClientError('用户不存在');
  }
  return user;
}

// 根据邮箱查找用户
async function findOneUserByEmail(email) {
  const user = await User.findOne({ where: { email } });
  // 没有则抛出错误
  if (!user) {
    throw new ClientError('用户不存在');
  }
  return user;
}

// 获取UserNotification
async function findNotificationById(userId) {
  const userNotification = await UserNotification.findOne({ where: { user_id: userId } });
  if (!userNotification) {
    throw new ClientError('获取用户通知失败');
  }
  return userNotification;
}

// 通过e5id获取UserE5Post
async function findE5PostById(e5id) {
  const e5Post = await UserE5Post.findOne({
    where: { user_id: e5id },
  });
  // 未找到则抛出错误
  if (!e5Post) {
    throw new ClientError('用户不存在');
  }
  return e5Post;
}

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

// 获取动态操作
async function getPosts(e5id) {
  // 通过e5id获取UserE5Post
  const e5Post = await findE5PostById(e5id);
  let posts;
  try {
    // 从字符串解析为帖子对象数组
    posts = JSON.parse(e5Post.posts);
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('动态列表损坏');
  }
  return posts;
}

// 保存动态操作
async function savePosts(e5id, posts) {
  try {
    // 直接更新数据，不需要重新查找
    await UserE5Post.update(
      { posts: JSON.stringify(posts) },
      { where: { user_id: e5id } },
    );
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('保存动态失败');
  }
}

// 获取用户通知操作
async function getNotifications(userId) {
  const userNotification = await findNotificationById(userId);
  let notifications;
  try {
    notifications = JSON.parse(userNotification.notifications);
  } catch (error) {
    throw new ServerError('通知列表损坏');
  }
  return notifications;
}

// 保存用户通知操作
async function saveNotifications(userId, notifications) {
  try {
    // 直接更新数据，不需要重新查找
    await UserNotification.update(
      { notifications: JSON.stringify(notifications) },
      { where: { user_id: userId } },
    );
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('保存通知失败');
  }
}

// 获取 helping_by_users
async function getHelpingByUsers(userId) {
  const user = await findOneUserById(userId);
  let helpingByUsers;
  try {
    // 从字符串解析为帖子对象数组
    helpingByUsers = JSON.parse(user.helping_by_users);
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('helping_by_users 列表损坏');
  }
  return helpingByUsers;
}

// 保存 helping_by_users
async function saveHelpingByUsers(userId, helpingByUsers) {
  try {
    // 使用 Set 和展开运算符去重数组
    const uniqueArray = [...new Set(helpingByUsers)];
    // 直接更新数据，不需要重新查找
    await User.update(
      { helping_by_users: JSON.stringify(uniqueArray) },
      { where: { id: userId } },
    );
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('保存 helping_by_users 失败');
  }
}

// 获取 helping_users
async function getHelpingUsers(userId) {
  const user = await findOneUserById(userId);
  let helpingUsers;
  try {
    // 从字符串解析为帖子对象数组
    helpingUsers = JSON.parse(user.helping_users);
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('helping_users 列表损坏');
  }
  return helpingUsers;
}

// 保存 helping_users
async function saveHelpingUsers(userId, helpingUsers) {
  try {
    // 使用 Set 和展开运算符去重数组
    const uniqueArray = [...new Set(helpingUsers)];
    // 直接更新数据，不需要重新查找
    await User.update(
      { helping_users: JSON.stringify(uniqueArray) },
      { where: { id: userId } },
    );
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('保存 helping_users 失败');
  }
}

// 获取 shared_info
async function getShareInfo(userId) {
  const e5SharedInfo = await findE5SharedInfoById(userId);
  let sharedInfo;
  try {
    // 从字符串解析为帖子对象数组
    sharedInfo = JSON.parse(e5SharedInfo.shared_info);
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('shared_info 列表损坏');
  }
  return sharedInfo;
}

// 保存 shared_info
async function saveShareInfo(userId, sharedInfo) {
  try {
    // 直接更新数据，不需要重新查找
    await UsersE5SharedInfo.update(
      { shared_info: JSON.stringify(sharedInfo) },
      { where: { user_id: userId } },
    );
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('保存 shared_info 失败');
  }
}

// 获取 helped_by_users
async function getHelpedByUsers(userId) {
  const user = await findOneUserById(userId);
  let helpedByUsers;
  try {
    // 从字符串解析为帖子对象数组
    helpedByUsers = JSON.parse(user.helped_by_users);
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('helped_by_users 列表损坏');
  }
  return helpedByUsers;
}

// 保存 helped_by_users
async function saveHelpedByUsers(userId, helpedByUsers) {
  try {
    // 使用 Set 和展开运算符去重数组
    const uniqueArray = [...new Set(helpedByUsers)];
    // 直接更新数据，不需要重新查找
    await User.update(
      { helped_by_users: JSON.stringify(uniqueArray) },
      { where: { id: userId } },
    );
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('保存 helped_by_users 失败');
  }
}

// 获取 helped_users
async function getHelpedUsers(userId) {
  const user = await findOneUserById(userId);
  let helpedUsers;
  try {
    // 从字符串解析为帖子对象数组
    helpedUsers = JSON.parse(user.helped_users);
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('helped_users 列表损坏');
  }
  return helpedUsers;
}

// 保存 helped_users
async function saveHelpedUsers(userId, helpedUsers) {
  try {
    // 使用 Set 和展开运算符去重数组
    const uniqueArray = [...new Set(helpedUsers)];
    // 直接更新数据，不需要重新查找
    await User.update(
      { helped_users: JSON.stringify(uniqueArray) },
      { where: { id: userId } },
    );
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('保存 helped_users 失败');
  }
}

module.exports = {
  findOneUserById,
  findOneUserByUsername,
  findOneUserByEmail,
  findNotificationById,
  findE5PostById,
  findE5SharedInfoById,
  getPosts,
  savePosts,
  getNotifications,
  saveNotifications,
  getHelpingByUsers,
  saveHelpingByUsers,
  getHelpingUsers,
  saveHelpingUsers,
  getShareInfo,
  saveShareInfo,
  getHelpedByUsers,
  saveHelpedByUsers,
  getHelpedUsers,
  saveHelpedUsers,
};
