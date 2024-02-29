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
      message: 'e5分享登记成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, 'e5分享登记失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};

// 注销分享处理函数
exports.cancelShare = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { message } = req.body;

    // 注销分享
    await shareService.cancelShare(id, message);

    // 返回成功的响应
    res.status(204).json({
      code: 0,
      message: 'e5分享注销成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, 'e5分享注销失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};

// 申请分享处理函数
exports.sendApplication = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { e5id, message } = req.body;

    // 分享申请
    const data = await shareService.sendApplication(id, e5id, message);

    // 返回成功的响应
    res.status(201).json({
      code: 0,
      message: '申请成功',
      data, // 响应申请通知内容
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '申请失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};

// 获取分享信息处理函数
exports.getE5ShareInfo = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id

    // 获取分享信息
    const data = await shareService.getE5ShareInfo(id);

    // 返回成功的响应
    res.status(200).json({
      code: 0,
      message: '分享信息获取成功',
      data, // 响应分享信息
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '分享信息获取失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};

// 添加分享信息处理函数
exports.addE5ShareInfo = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { userId, note } = req.body;

    // 添加分享信息
    const data = await shareService.addE5ShareInfo(id, userId, note);

    // 返回成功的响应
    res.status(201).json({
      code: 0,
      message: '分享信息添加成功',
      data, // 响应添加的分享信息
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '分享信息添加失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};

// 修改分享信息处理函数
exports.updateE5ShareInfo = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { userId, note } = req.body;

    // 修改分享信息
    const data = await shareService.updateE5ShareInfo(id, userId, note);

    // 返回成功的响应
    res.status(200).json({
      code: 0,
      message: '分享信息修改成功',
      data, // 响应修改的分享信息
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '分享信息修改失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};

// 删除分享信息处理函数
exports.deleteE5ShareInfo = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { userId } = req.params;

    // 删除分享信息
    await shareService.deleteE5ShareInfo(id, userId);

    // 返回成功的响应
    res.status(204).json({
      code: 0,
      message: '分享信息删除成功',
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '分享信息删除失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};

// 发送分享确认处理函数
exports.sendConfirmation = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { userId, message } = req.body;

    // 发送分享确认
    const data = await shareService.sendConfirmation(id, userId, message);

    // 返回成功的响应
    res.status(201).json({
      code: 0,
      message: '发送分享确认成功',
      data, // 响应发送的分享确认通知信息
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '发送分享确认失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};

// 接受分享确认处理函数
exports.acceptConfirmation = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { e5id, message } = req.body;

    // 接受分享确认
    const data = await shareService.acceptConfirmation(id, e5id, message);

    // 返回成功的响应
    res.status(201).json({
      code: 0,
      message: '接受分享确认成功',
      data, // 响应发送的分享完成通知信息
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '接受分享确认失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};

// e5账号主停止对用户的分享
exports.stopSharing = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { userId, message } = req.body;

    // e5账号主停止分享
    const data = await shareService.stopSharing(id, userId, message);

    // 返回成功的响应
    res.status(201).json({
      code: 0,
      message: '停止分享成功',
      data, // 响应发送的通知信息
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '停止分享失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};

// 用户停止接受e5账号主的分享
exports.stopReceiving = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const { id } = req.user; // 用户id
    const { e5id, message } = req.body;

    // 用户停止接受e5账号主的分享
    const data = await shareService.stopReceiving(id, e5id, message);

    // 返回成功的响应
    res.status(201).json({
      code: 0,
      message: '停止分享成功',
      data, // 响应发送的通知信息
    });
  } catch (error) {
    // 如果发生错误，获取错误信息，并根据情况响应错误信息
    const errorInfo = errorHandler(error, '停止分享失败');
    res.status(errorInfo.status).json({
      code: 1,
      message: errorInfo.message,
    });
  }
};
