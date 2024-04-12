// 生成 Token 字符串
const jwt = require('jsonwebtoken');

// 自定义错误对象
const { ClientError } = require('./errors/index');
// jwt配置文件
const { jwtAdmin } = require('../config');

// admin配置模块
const {
  getAdminUsername,
  getAdminPassword,
  getAdminConfig,
  updateAdminInfo,
  updateAdminAuth,
} = require('../admin/index');

// 已定义的业务操作
const { cancelShare, stopReceiving } = require('./shareService');

// 数据模块
const {
  getHelpingByUsers,
} = require('./dataService');

// 用于操作数据库的模型
const {
  User, UserE5Post, UserNotification, UsersE5SharedInfo,
} = require('../models/index');

// 管理员登录
const loginAdmin = async (username, password) => {
  // 对比用户名密码
  if (username !== getAdminUsername() || password !== getAdminPassword()) {
    throw new ClientError('密码或用户名错误');
  }
  // 配置负载
  const payload = { admin: true };
  // 生成token
  const tokenStr = jwt.sign(payload, jwtAdmin.secretKey, {
    expiresIn: jwtAdmin.expiresIn,
  });
  // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
  return `Bearer ${tokenStr}`;
};

// 获取管理信息，排除password
const getAdmin = async () => {
  const { password, ...data } = getAdminConfig();
  return data;
};

// 修改管理员信息
const updateAdmin = async (couldRegister) => {
  updateAdminInfo(couldRegister);
};

// 修改登录信息
const updateAuth = async (username, password) => {
  updateAdminAuth(username, password);
};

// 用户注销
async function deleteUser(userId) {
  // 获取helping_by_users，用户不存在则会抛出错误
  const helpingByUsers = await getHelpingByUsers(userId);

  // 停止接受分享
  const promises = helpingByUsers.map(async (helpingByUserId) => {
    // 停止接受分享
    await stopReceiving(userId, helpingByUserId, '用户已注销').catch(() => {});
  });
    // 等待所有异步操作完成
  await Promise.all(promises).catch(() => {});

  // 注销分享
  await cancelShare(userId, '用户已注销').catch(() => {});

  // 从 通知表、动态表、分享信息表、用户表，中删除（注意顺序，因为有外键）
  await UserNotification.destroy({ where: { user_id: userId } }).catch(() => {});
  await UserE5Post.destroy({ where: { user_id: userId } }).catch(() => {});
  await UsersE5SharedInfo.destroy({ where: { user_id: userId } }).catch(() => {});
  await User.destroy({ where: { id: userId } }).catch(() => {});
}

module.exports = {
  loginAdmin,
  getAdmin,
  updateAdmin,
  updateAuth,
  deleteUser,
};
