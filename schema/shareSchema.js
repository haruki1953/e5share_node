const joi = require('joi');
const { updateE5infoSchema } = require('./userSchema');

// 留言校验规则
const message = joi.string().max(500).allow('').optional();

// 登记分享的验证规则对象
exports.registerShareSchema = updateE5infoSchema;

// 注销分享的验证规则对象
exports.cancelShareSchema = {
  body: {
    message,
  },
};
