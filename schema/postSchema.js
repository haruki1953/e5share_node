const joi = require('joi');

// 定义 id e5账号主的校验规则
const e5id = joi.number().integer().min(1).required();

// 帖子内容校验规则
const content = joi.string().max(500).required();

// 帖子uuid校验规则
const uuid = joi.string().guid({ version: 'uuidv4' }).required();

// 校验规则对象 - 获取e5动态
exports.getPostsSchema = {
  params: {
    e5id,
  },
};

// 校验规则对象 - 发送动态
exports.sendPostSchema = {
  body: {
    e5id,
    content,
  },
};

// 校验规则对象 - 删除动态
exports.deletePostSchema = {
  query: {
    e5id,
    uuid,
  },
};
