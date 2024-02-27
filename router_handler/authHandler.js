// 导入业务逻辑操作
const authService = require('../services/authService');
// 导入错误处理函数
const { errorHandler } = require('../services/errors/index');

// 注册用户的处理函数
exports.register = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const {
      username, password, email,
    } = req.body;

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
};

// 用户名登录的处理函数
exports.loginByUsername = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const {
      username, password,
    } = req.body;

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
};

// 邮箱登录的处理函数
exports.loginByEmail = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const {
      email, password,
    } = req.body;

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
};
