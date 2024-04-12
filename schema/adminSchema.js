const joi = require('joi');

// userId 的校验规则
const userId = joi.number().integer().min(1).required();

// 用户名的验证规则 必填 长度1到32 只能包含字母数字下划线
const username = joi.string().regex(/^[a-zA-Z0-9_]{1,32}$/).required();

// 密码的验证规则 必填 6到32 只能包含字母数字下划线
const password = joi.string().regex(/^[a-zA-Z0-9_]{6,32}$/).required();

// 邮箱的验证规则
const email = joi.string().max(100).email().required();

// couldRegister 验证规则
const couldRegister = joi.boolean().required();

// 用户名登录表单的验证规则对象
exports.loginAdminSchema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password,
  },
};

// 修改管理信息
exports.updateAdminSchema = {
  body: {
    couldRegister,
  },
};

// 修改登录信息
exports.updateAuthSchema = {
  body: {
    username,
    password,
  },
};

// 用户注册
exports.registerUserSchema = {
  body: {
    username,
    password,
    email,
  },
};

// 修改用户密码
exports.updateUserPasswordSchema = {
  body: {
    userId,
    newPassword: password,
  },
};

// 注销用户
exports.deleteUserSchema = {
  params: {
    userId,
  },
};
