const { User } = require('../models/index');

// 注册用户的处理函数
exports.register = async (req, res) => {
  try {
    // 从请求中获取用户信息
    const {
      username, password, email, nickname,
    } = req.body;

    // 在数据库中创建新用户
    const newUser = await User.create({
      username,
      password_hash: password, // 在实际应用中，应该使用加密算法对密码进行哈希处理
      email,
      nickname,
    });

    // 返回成功的响应
    res.status(201).json({
      code: 0,
      message: '注册成功！',
      data: newUser, // 如果需要返回新创建的用户信息，可以将其包含在响应中
    });
  } catch (error) {
    // 如果发生错误，返回错误的响应
    console.error('注册用户时发生错误:', error);
    res.status(500).json({
      code: 1,
      message: '注册用户时发生错误，请稍后重试！',
    });
  }
};

// 登录的处理函数
exports.login = (req, res) => {
  res.send('login OK');
};
