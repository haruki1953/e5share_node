// 导入业务逻辑操作
const adminService = require('../services/adminService');
const publicService = require('../services/publicService');
const authService = require('../services/authService');
const userService = require('../services/userService');

// 导入错误处理函数
const { errorHandler } = require('../services/errors/index');

const { logAdmin } = require('../utils/logger');

// 管理员登录的处理函数
exports.loginAdmin = async (req, res) => {
  // 从请求中获取用户信息
  const {
    username, password,
  } = req.body;
  try {
    // 登录操作
    const token = await adminService.loginAdmin(username, password);

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
  logAdmin(req, res, { username });
};

// 获取管理信息
exports.getAdmin = async (req, res) => {
  let data = {};
  try {
    // 获取管理信息
    data = await adminService.getAdmin();

    // 返回成功的响应
    res.status(200).json({
      code: 0,
      message: '获取成功',
      data,
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '获取失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logAdmin(req, res, data);
};

// 修改管理信息
exports.updateAdmin = async (req, res) => {
  const { couldRegister } = req.body;
  try {
    // 修改管理信息
    await adminService.updateAdmin(couldRegister);

    // 返回成功的响应
    res.status(204).json({
      code: 0,
      message: '修改成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '修改失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logAdmin(req, res, { couldRegister });
};

// 修改登录信息
exports.updateAuth = async (req, res) => {
  const {
    username, password,
  } = req.body;
  try {
    await adminService.updateAuth(username, password);

    // 返回成功的响应
    res.status(204).json({
      code: 0,
      message: '修改成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '修改失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logAdmin(req, res, { username });
};

// 获取全部用户
exports.getUsers = async (req, res) => {
  try {
    const data = await publicService.getUsers(true);

    // 返回成功的响应
    res.status(200).json({
      code: 0,
      message: '获取成功',
      data,
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '获取失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logAdmin(req, res);
};

// 注册用户的处理函数
exports.registerUser = async (req, res) => {
  // 从请求中获取用户信息
  const {
    username, password, email,
  } = req.body;
  try {
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
  logAdmin(req, res, { username, email });
};

// 修改用户密码的处理函数
exports.updateUserPassword = async (req, res) => {
  // 从请求中获取用户信息
  const {
    userId, newPassword,
  } = req.body;
  try {
    // 调用修改密码服务 管理员
    await userService.updatePassword(userId, '', newPassword, true);

    // 返回成功的响应
    res.status(204).json({
      code: 0,
      message: '修改成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '修改失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logAdmin(req, res, { userId });
};

// 注销用户的处理函数
exports.deleteUser = async (req, res) => {
  // 从请求中获取用户信息
  const {
    userId,
  } = req.params;
  try {
    // 调用注销用户服务
    await adminService.deleteUser(userId);

    // 返回成功的响应
    res.status(204).json({
      code: 0,
      message: '注销成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '注销失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logAdmin(req, res, { userId });
};
