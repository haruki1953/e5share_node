// 导入业务逻辑操作
const userService = require('../services/userService');
// 导入错误处理函数
const { errorHandler } = require('../services/errors/index');

// 获取个人信息的处理函数
exports.getProfile = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user;

    // 获取个人信息
    const data = await userService.getProfile(id);

    // 返回成功的响应
    res.status(201).json({
      code: 0,
      message: '个人信息获取成功',
      data,
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '个人信息获取失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};

// 修改基本信息的处理函数
exports.updateProfile = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user;
    const { nickname, contactInfo, bio } = req.body;

    // 获取个人信息
    await userService.updateProfile(id, nickname, contactInfo, bio);

    // 返回成功的响应
    res.status(201).json({
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
};
