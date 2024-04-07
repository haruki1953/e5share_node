// 导入业务逻辑操作
const postService = require('../services/postService');
// 导入错误处理函数
const { errorHandler } = require('../services/errors/index');

const { logWeb } = require('../utils/logger');

// 获取动态的处理函数
exports.getE5Posts = async (req, res) => {
  // 从请求中获取用户信息
  const { id } = req.user; // 用户id
  const { e5id } = req.params; // e5账号主的id
  try {
    // 获取动态
    const data = await postService.getE5Posts(id, e5id);

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
  logWeb(req, res, { id, e5id });
};

// 发送动态的处理函数
exports.sendE5Post = async (req, res) => {
  // 从请求中获取用户信息
  const { id } = req.user; // 用户id
  const { e5id, content } = req.body; // e5账号主的id 与内容
  try {
    // 发送帖子
    await postService.sendE5Post(id, e5id, content);

    // 返回成功的响应
    res.status(201).json({
      code: 0,
      message: '发送成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '发送失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logWeb(req, res, { id, e5id, content });
};

// 删除动态的处理函数
exports.deleteE5Post = async (req, res) => {
  // 从请求中获取用户信息
  const { id } = req.user; // 用户id
  const { e5id, uuid } = req.query; // e5账号主的id 与 帖子id（uuid）
  try {
    // 删除帖子
    await postService.deleteE5Post(id, e5id, uuid);

    // 返回成功的响应
    res.status(204).json({
      code: 0,
      message: '删除成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '删除失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logWeb(req, res, { id, e5id, uuid });
};

// 清空动态的处理函数
exports.clearE5Posts = async (req, res) => {
  // 从请求中获取用户信息
  const { id } = req.user; // 用户id
  try {
    // 清空动态
    await postService.clearE5Posts(id);

    // 返回成功的响应
    res.status(204).json({
      code: 0,
      message: '清空动态成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '清空动态失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
  logWeb(req, res, { id });
};
