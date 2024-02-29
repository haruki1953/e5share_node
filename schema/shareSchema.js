const joi = require('joi');
const { updateE5infoSchema } = require('./userSchema');

// 定义 id 的校验规则
const id = joi.number().integer().min(1).required();

// 留言校验规则
const message = joi.string().max(500).allow('').required();
// 备注校验规则
const note = joi.string().max(500).allow('').required();

// 登记分享的验证规则对象
exports.registerShareSchema = updateE5infoSchema;

// 注销分享的验证规则对象
exports.cancelShareSchema = {
  body: {
    message,
  },
};

// 申请分享的验证规则对象
exports.sendApplicationSchema = {
  body: {
    e5id: id,
    message,
  },
};

// 添加分享信息的验证规则对象
exports.addE5ShareInfoSchema = {
  body: {
    userId: id,
    note,
  },
};

// 修改分享信息的验证规则对象
exports.updateE5ShareInfoSchema = {
  body: {
    userId: id,
    note,
  },
};

// 删除分享信息的验证规则对象
exports.deleteE5ShareInfoSchema = {
  params: {
    userId: id,
  },
};

// 发送分享确认的验证规则对象
exports.sendConfirmationSchema = {
  body: {
    userId: id,
    message,
  },
};

// 接受分享确认的验证规则对象
exports.acceptConfirmationSchema = {
  body: {
    e5id: id,
    message,
  },
};

// e5账号主停止对用户的分享的验证规则对象
exports.stopSharingSchema = {
  body: {
    userId: id,
    message,
  },
};

// 用户停止接受e5账号主的分享的验证规则对象
exports.stopReceivingSchema = {
  body: {
    e5id: id,
    message,
  },
};
