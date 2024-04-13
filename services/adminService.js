// 生成 Token 字符串
const jwt = require('jsonwebtoken');

const fs = require('fs');
const path = require('path');

// 自定义错误对象
const { ClientError } = require('./errors/index');
// jwt配置、头像配置
const { jwtAdmin, avatarConfig } = require('../config');

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
  findOneUserById,
} = require('./dataService');

// 用于操作数据库的模型
const {
  User, UserE5Post, UserNotification, UsersE5SharedInfo,
} = require('../models/index');

const { logError } = require('../utils/logger');

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
  // 获取用户，用户不存在则会抛出错误
  const user = await findOneUserById(userId);
  // 删除头像
  try {
    if (user.avatar) {
      const avatarPath = path.join(avatarConfig.savePath, user.avatar);
      fs.unlinkSync(avatarPath);
    }
  } catch (error) {
    logError(
      error,
      { file: 'adminService.js', method: 'deleteUser', message: `${userId} 删除头像失败` },
    );
  }

  // 获取helping_by_users，用户不存在则会抛出错误
  const helpingByUsers = await getHelpingByUsers(userId);

  // 停止接受分享
  const promises = helpingByUsers.map(async (helpingByUserId) => {
    // 停止接受分享
    await stopReceiving(userId, helpingByUserId, '用户已注销').catch((error) => {
      logError(
        error,
        {
          file: 'adminService.js',
          method: 'deleteUser',
          message: `${userId} 停止接受用户 ${helpingByUserId} 的分享失败`,
        },
      );
    });
  });
  // 等待所有异步操作完成
  await Promise.all(promises).catch((error) => {
    logError(
      error,
      { file: 'adminService.js', method: 'deleteUser', message: `${userId} 停止接受分享失败` },
    );
  });

  // 注销分享
  await cancelShare(userId, '用户已注销').catch((error) => {
    logError(
      error,
      { file: 'adminService.js', method: 'deleteUser', message: `${userId} 注销分享失败` },
    );
  });

  // 从 通知表、动态表、分享信息表、用户表，中删除（注意顺序，因为有外键）
  await UserNotification.destroy({ where: { user_id: userId } }).catch((error) => {
    logError(
      error,
      { file: 'adminService.js', method: 'deleteUser', message: `${userId} 删除 UserNotification 失败` },
    );
  });
  await UserE5Post.destroy({ where: { user_id: userId } }).catch((error) => {
    logError(
      error,
      { file: 'adminService.js', method: 'deleteUser', message: `${userId} 删除 UserE5Post 失败` },
    );
  });
  await UsersE5SharedInfo.destroy({ where: { user_id: userId } }).catch((error) => {
    logError(
      error,
      { file: 'adminService.js', method: 'deleteUser', message: `${userId} 删除 UsersE5SharedInfo 失败` },
    );
  });
  await User.destroy({ where: { id: userId } }).catch((error) => {
    logError(
      error,
      { file: 'adminService.js', method: 'deleteUser', message: `${userId} 删除 User 失败` },
    );
  });
}

module.exports = {
  loginAdmin,
  getAdmin,
  updateAdmin,
  updateAuth,
  deleteUser,
};
