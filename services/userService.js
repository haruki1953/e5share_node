const bcrypt = require('bcryptjs');
const { User } = require('../models/index');
const { ClientError, ServerError } = require('./errors/index');

// 确认用户名不存在
async function confirmUsernameNotExists(username) {
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new ClientError('用户名已存在');
  }
}

// 确认邮箱不存在
async function confirmEmailNotExists(email) {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ClientError('邮箱已被注册');
  }
}

// 注册用户操作
async function registerUser(username, password, email) {
  // 确认用户名不存在
  await confirmUsernameNotExists(username);
  // 确认邮箱不存在
  await confirmEmailNotExists(email);

  // 密码哈希处理
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // 创建新用户
    await User.create({
      username,
      password_hash: hashedPassword,
      email,
    });
  } catch (error) {
    throw new ServerError('创建用户失败');
  }
}

// 用户名登录
async function loginByUsername(username, password) {

}

// 邮箱登录
async function loginByEmail(email, password) {

}

module.exports = {
  registerUser,
  loginByUsername,
  loginByEmail,
};
