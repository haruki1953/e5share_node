// 导入业务逻辑操作
const userService = require('../services/userService');
// 导入错误处理函数
const { errorHandler, ClientError } = require('../services/errors/index');
// 从通知服务导入清空通知函数
const { clearNotification } = require('../services/notificationService');

const { logWeb } = require('../utils/logger');

// 获取个人信息的处理函数
exports.getProfile = async (req, res) => {
  // 从请求中获取用户信息
  const { id } = req.user;
  try {
    // 获取个人信息
    const data = await userService.getProfile(id);

    // 返回成功的响应
    res.status(200).json({
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
  logWeb(req, res, { id });
};

// 修改基本信息的处理函数
exports.updateProfile = async (req, res) => {
  // 从请求中获取用户信息
  const { id } = req.user;
  const { nickname, contactInfo, bio } = req.body;
  try {
    // 获取个人信息
    await userService.updateProfile(id, nickname, contactInfo, bio);

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
  logWeb(req, res, {
    id, nickname, contactInfo, bio,
  });
};

// 修改头像的处理函数
exports.updateAvatar = async (req, res) => {
  // 从请求中获取用户信息
  const { id } = req.user;
  let filename = null;

  try {
    // 手动判断是否上传了头像
    if (!req.file || req.file.fieldname !== 'avatar') throw new ClientError('头像上传失败');
    // console.log(req.file);

    filename = req.file.filename;

    // 修改头像
    await userService.updateAvatar(id, filename);

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
  logWeb(req, res, { id, filename });
};

// 修改邮箱的处理函数
exports.updateEmail = async (req, res) => {
  // 从请求中获取用户信息
  const { id } = req.user;
  const { email } = req.body;
  try {
    // 修改邮箱
    await userService.updateEmail(id, email);

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
  logWeb(req, res, { id, email });
};

// 修改密码的处理函数
exports.updatePassword = async (req, res) => {
  // 从请求中获取用户信息
  const { id } = req.user;
  const { oldPassword, newPassword } = req.body;
  try {
    // 修改密码
    await userService.updatePassword(id, oldPassword, newPassword);

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
  logWeb(req, res, { id });
};

// 修改e5订阅信息的处理函数
exports.updateE5info = async (req, res) => {
  // 从请求中获取用户信息
  const { id } = req.user;
  const { subscriptionDate, expirationDate } = req.body;
  try {
    // 修改e5订阅信息
    await userService.updateE5info(id, subscriptionDate, expirationDate);

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
  logWeb(req, res, { id, subscriptionDate, expirationDate });
};

// 清空通知处理函数
exports.clearNotif = async (req, res) => {
  // 从请求中获取用户信息
  const { id } = req.user; // 用户id
  try {
    // 清空通知
    await clearNotification(id);

    // 返回成功的响应
    res.status(204).json({
      code: 0,
      message: '清空通知成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '清空通知失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logWeb(req, res, { id });
};

// 清空通知处理函数
exports.getLastLoginTime = async (req, res) => {
  // 从请求中获取用户信息
  const { id } = req.user; // 用户id
  const { userId } = req.params;
  try {
    // 获取用户最后登录时间
    const data = await userService.getLastLoginTime(userId);

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
  logWeb(req, res, { id, userId });
};
