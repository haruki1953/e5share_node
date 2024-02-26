const express = require('express');

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi');

// 导入数据库处理函数
const postHandler = require('../router_handler/postHandler');

// 导入需要的验证规则对象
const {
  getPostsSchema,
  sendPostSchema,
  deletePostSchema,
} = require('../schema/postSchema');

// 创建路由对象
const router = express.Router();

// 获取e5动态
router.get('/posts/:e5id', expressJoi(getPostsSchema), postHandler.getPosts);
// 发送帖子
router.post('/post', expressJoi(sendPostSchema), postHandler.sendPost);
// 删除帖子
router.delete('/post', expressJoi(deletePostSchema), postHandler.deletePost);

// 将路由对象共享出去
module.exports = router;
