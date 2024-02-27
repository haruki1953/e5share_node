// Sequelize 实例
const { sequelize } = require('../db/index');
// 用于操作数据库的模型
const { UsersE5SharedInfo } = require('../models/index');
// 自定义错误对象
const { ClientError, ServerError } = require('./errors/index');
// 已定义的业务操作
const { findOneUserById, updateE5info } = require('./userService');
const { findE5PostById } = require('./postService');
// 配置文件 用户状态配置
const { e5shareConfig, accountStatusConfig } = require('../config');

// 通过user_id获取UsersE5SharedInfo
async function findE5SharedInfoById(id) {
  const sharedInfo = await UsersE5SharedInfo.findOne({
    where: { user_id: id },
  });
  // 未找到则抛出错误
  if (!sharedInfo) {
    throw new ClientError('用户不存在');
  }
  return sharedInfo;
}

// 登记分享
async function registerShare(id, subscriptionDate, expirationDate) {
  // 获取用户
  let user = await findOneUserById(id);
  // 判断状态是否为可以开始分享的状态，如“active”。（正在分享 sharing_e5 则不需要再登记了）
  if (!e5shareConfig.allowRegistrationStatus.includes(user.account_status)) {
    // 如果不是允许注册的状态则抛出错误
    if (user.account_status === accountStatusConfig.sharing) throw new ClientError('状态已为正在分享');
    throw new ClientError('当前用户状态不能登记分享');
  }

  // 调用已有服务 设置e5开始时间与到期时间
  await updateE5info(id, subscriptionDate, expirationDate);

  // 重新获取用户，因为信息已更改
  user = await findOneUserById(id);
  // 将用户状态设置为 sharing
  user.account_status = accountStatusConfig.sharing;
  // helping_users 字段清空
  user.helping_users = '[]';

  // 获取动态，清空
  const e5Post = await findE5PostById(id);
  e5Post.posts = '[]';
  // 获取分享信息，清空
  const sharedInfo = await findE5SharedInfoById(id);
  sharedInfo.shared_info = '[]';

  // 使用事务保存信息
  let transaction;
  try {
    // 开启事务
    transaction = await sequelize.transaction();

    await user.save({ transaction });
    await e5Post.save({ transaction });
    await sharedInfo.save({ transaction });

    // 提交事务
    await transaction.commit();
  } catch (error) {
    // 出错则回滚事务
    if (transaction) await transaction.rollback();
    throw new ServerError('保存失败');
  }
}

module.exports = {
  registerShare,
};
