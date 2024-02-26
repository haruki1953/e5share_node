// 导入业务逻辑操作
const publicService = require('../services/publicService');
// 导入错误处理函数
const { errorHandler } = require('../services/errors/index');

// 获取全部用户信息的处理函数
exports.getUsers = async (req, res) => {
  try {
    // 获取全部用户信息
    const data = await publicService.getUsers();

    // 返回成功的响应
    res.status(201).json({
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
};
