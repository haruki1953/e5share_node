// 用于操作数据库的模型
const { User, UserNotification } = require('../models/index');

// 自定义错误对象
const { ClientError } = require('./errors/index');

// 根据id查找用户
async function findOneUserById(id) {
  const user = await User.findByPk(id);
  // 没有则抛出错误
  if (!user) {
    throw new ClientError('用户不存在');
  }
  return user;
}

// 修改最后登录时间
async function updateLastLoginTime(id) {
  try {
    // 更新最后登录时间为当前时间
    await User.update({ last_login: new Date() }, { where: { id } });
  } catch (error) {
    throw new ClientError('更新最后登录时间失败');
  }
}

// 获取用户通知
async function getUserNotifications(userId) {
  const userNotification = await UserNotification.findOne({ where: { user_id: userId } });
  if (!userNotification) {
    throw new ClientError('获取用户通知失败');
  }
  return JSON.parse(userNotification.notifications);

  // 在前端解析通知字符串，减小后端压力（
  // return userNotification.notifications;
}

// 获取个人信息
async function getProfile(id) {
  // 根据id查找用户
  const user = await findOneUserById(id);

  // 获取用户通知
  const notifications = await getUserNotifications(id);

  // 修改最后登录时间，在查询后再修改，这样前端可以获取到上次登录的时间
  await updateLastLoginTime(id);

  // 整理返回数据
  const data = {
    id: user.id,
    username: user.username,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    contact_info: user.contact_info,
    bio: user.bio,
    registered_at: user.registered_at,
    last_login: user.last_login,
    account_status: user.account_status,
    e5_subscription_date: user.e5_subscription_date,
    e5_expiration_date: user.e5_expiration_date,
    helping_users: user.helping_users,
    helped_users: user.helped_users,
    helping_by_users: user.helping_by_users,
    helped_by_users: user.helped_by_users,
    notifications,
  };

  return data;
}

// 修改基本信息
async function updateProfile(id, nickname, contactInfo, bio) {
// 根据 id 查找用户
  const user = await findOneUserById(id);
  // 更新昵称、联系信息和简介
  user.nickname = nickname;
  user.contact_info = contactInfo;
  user.bio = bio;
  try {
    // 保存更新后的用户信息到数据库
    await user.save();
  } catch (error) {
    // 捕获并处理任何错误
    throw new ClientError('获取用户通知失败');
  }
  return user;
}

module.exports = {
  getProfile,
  updateProfile,
};
