const joi = require('joi');

// 用户名的验证规则 必填 长度1到32 只能包含字母数字下划线
const username = joi.string().regex(/^[a-zA-Z0-9_]{1,32}$/).required();

// 密码的验证规则 必填 6到32 只能包含字母数字下划线
const password = joi.string().regex(/^[a-zA-Z0-9_]{6,32}$/).required();

// 用户名登录表单的验证规则对象
exports.loginAdminSchema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password,
  },
};
