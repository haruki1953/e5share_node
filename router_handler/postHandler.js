// 导入业务逻辑操作
const postService = require('../services/postService');
// 导入错误处理函数
const { errorHandler } = require('../services/errors/index');

// 获取动态的处理函数
exports.getPosts = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { e5id } = req.params; // e5账号主的id

    // 获取动态
    const data = await postService.getPosts(id, e5id);

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

// 发送动态的处理函数
exports.sendPost = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { e5id, content } = req.body; // e5账号主的id 与内容

    // 获取动态
    await postService.sendPost(id, e5id, content);

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
};

// 删除动态的处理函数
exports.deletePost = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { e5id, uuid } = req.query; // e5账号主的id 与 帖子id（uuid）

    // 获取动态
    await postService.deletePost(id, e5id, uuid);

    // 返回成功的响应
    res.status(201).json({
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
};
