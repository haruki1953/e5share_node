// 导入业务逻辑操作
const authService = require('../services/authService');
// 导入错误处理函数
const { errorHandler, ServerError } = require('../services/errors/index');

const { logWeb } = require('../utils/logger');

const { adminContact } = require('../config');
// admin配置模块
const {
  getCouldRegister,
} = require('../admin/index');

// 注册用户的处理函数
exports.register = async (req, res) => {
  // 从请求中获取用户信息
  const {
    username, password, email,
  } = req.body;
  let couldRegister;
  try {
    couldRegister = getCouldRegister();
    if (!couldRegister) {
      throw new ServerError(`注册已关闭，获取账号请联系管理员 ${adminContact}`);
    }
    // 在数据库中创建新用户
    await authService.registerUser(username, password, email);

    // 返回成功的响应
    res.status(201).json({
      code: 0,
      message: '注册成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '注册失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logWeb(req, res, { username, email, couldRegister });
};

// 用户名登录的处理函数
exports.loginByUsername = async (req, res) => {
  // 从请求中获取用户信息
  const {
    username, password,
  } = req.body;
  try {
    // 登录操作
    const token = await authService.loginByUsername(username, password);

    // 返回成功的响应
    res.status(200).json({
      code: 0,
      message: '登录成功',
      token,
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '登录失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logWeb(req, res, { username });
};

// 邮箱登录的处理函数
exports.loginByEmail = async (req, res) => {
  // 从请求中获取用户信息
  const {
    email, password,
  } = req.body;
  try {
    // 登录操作
    const token = await authService.loginByEmail(email, password);

    // 返回成功的响应
    res.status(200).json({
      code: 0,
      message: '登录成功',
      token,
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '登录失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logWeb(req, res, { email });
};
