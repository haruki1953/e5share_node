const joi = require('joi');

/**
* string() 值必须是字符串
* alphanum() 值只能是包含 a-zA-Z0-9 的字符串
* min(length) 最小长度
* max(length) 最大长度
* required() 值是必填项，不能为 undefined
* pattern、regex(正则表达式) 值必须符合正则表达式的规则
*/

// 用户名的验证规则 必填 长度1到32 只能包含字母数字下划线
const username = joi.string().regex(/^[a-zA-Z0-9_]{1,32}$/).required();

// 密码的验证规则 必填 6到32 只能包含字母数字下划线
const password = joi.string().regex(/^[a-zA-Z0-9_]{6,32}$/).required();

// 邮箱的验证规则
const email = joi.string().max(100).email().required();

// 昵称的校验规则：必填，最大长度32
const nickname = joi.string().max(32).allow('').required()
  .label('Nickname');

// 联系信息的校验规则：必填，最大长度500
const contactInfo = joi.string().max(500).allow('').required()
  .label('ContactInfo');

// 简介的校验规则：必填，最大长度500
const bio = joi.string().max(500).allow('').required()
  .label('Bio');

// 日期字符串的校验规则
const date = joi.string().regex(/^\d{4}-\d{2}-\d{2}$/).required();

// userId 的校验规则
const userId = joi.number().integer().min(1).required();

// 注册表单的验证规则对象
exports.regUserSchema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password,
    email,
  },
};

// 用户名登录表单的验证规则对象
exports.loginByUsernameSchema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password,
  },
};

// 邮箱登录表单的验证规则对象
exports.loginByEmailSchema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    email,
    password,
  },
};

// 修改基本信息表单的验证规则对象
exports.updateProfileSchema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    nickname,
    contactInfo,
    bio,
  },
};

// 修改邮箱的验证规则对象
exports.updateEmailSchema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    email,
  },
};

// 修改密码的验证规则对象
exports.updatePasswordSchema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    oldPassword: password,
    newPassword: password,
  },
};

// 修改e5订阅信息的验证规则对象
exports.updateE5infoSchema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    subscriptionDate: date,
    expirationDate: date,
  },
};

// 获取用户最后登录时间的验证规则对象
exports.getLastLoginTimeSchema = {
  params: {
    userId,
  },
};
