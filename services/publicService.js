// 用于操作数据库的模型
const { User } = require('../models/index');
// 自定义错误对象
const { ServerError } = require('./errors/index');

// 获取全部用户信息
async function getUsers(isAdmin = false) {
  try {
    let users;

    if (isAdmin) {
      // 管理员调用时
      users = await User.findAll({
        attributes: { exclude: ['password_hash'] },
      });
    } else {
      // 查询所有用户信息，排除密码和备注字段，排除last_login,updatedAt字段
      users = await User.findAll({
        attributes: { exclude: ['password_hash', 'note', 'last_login', 'updatedAt'] },
      });
    }
    return users;
  } catch (error) {
    // 如果发生错误，抛出服务器错误
    throw new ServerError('数据库获取失败');
  }
}

module.exports = {
  getUsers,
};
