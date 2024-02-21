/**
* 在这里定义和用户相关的路由处理函数，供 /router/authRouter.js 模块进行调用
*/

// 注册用户的处理函数
exports.register = (req, res) => {
  res.send('reguser OK');
};

// 登录的处理函数
exports.login = (req, res) => {
  res.send('login OK');
};
