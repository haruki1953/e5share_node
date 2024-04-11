// 导入业务逻辑操作
const adminService = require('../services/adminService');
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
