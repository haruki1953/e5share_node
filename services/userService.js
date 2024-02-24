// 密码加密
const bcrypt = require('bcryptjs');
// 生成 Token 字符串
const jwt = require('jsonwebtoken');

// 用于操作数据库的模型
const { User } = require('../models/index');

// 自定义错误对象
const { ClientError, ServerError } = require('./errors/index');

// jwt配置文件
const { jwtConfig } = require('../config');

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

// 确认用户的密码正确
function confirmUserPassword(user, password) {
  const passwordMatch = bcrypt.compareSync(password, user.password_hash);
  if (!passwordMatch) {
    throw new ClientError('密码错误');
  }
}

// 生成 Token 字符串
function generateToken(user) {
  // 配置负载
  const payload = { id: user.id, username: user.username };
  // 生成token
  const tokenStr = jwt.sign(payload, jwtConfig.secretKey, {
    expiresIn: jwtConfig.expiresIn,
  });
  // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
  return `Bearer ${tokenStr}`;
}

// 用户名登录
async function loginByUsername(username, password) {
  // 根据用户名获取用户
  const user = await findOneUserByUsername(username);

  // 确认用户的密码正确
  confirmUserPassword(user, password);

  // 生成 Token 并返回
  return generateToken(user);
}

// 邮箱登录
async function loginByEmail(email, password) {
  // 根据邮箱获取用户
  const user = await findOneUserByEmail(email);

  // 确认用户的密码正确
  confirmUserPassword(user, password);

  // 生成 Token 并返回
  return generateToken(user);
}

module.exports = {
  registerUser,
  loginByUsername,
  loginByEmail,
};
