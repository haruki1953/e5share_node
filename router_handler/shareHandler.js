// 导入业务逻辑操作
const shareService = require('../services/shareService');
// 导入错误处理函数
const { errorHandler } = require('../services/errors/index');

// 登记分享处理函数
exports.registerShare = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { subscriptionDate, expirationDate } = req.body;

    // 登记分享
    await shareService.registerShare(id, subscriptionDate, expirationDate);

    // 返回成功的响应
    res.status(200).json({
      code: 0,
      message: '登记分享成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '登记分享失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};
