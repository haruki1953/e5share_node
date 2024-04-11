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
} = require('../admin/index');

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

module.exports = {
  loginAdmin,
  getAdmin,
};
