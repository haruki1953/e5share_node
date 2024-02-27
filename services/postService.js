// 用于生成帖子的uuid
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require('uuid');

// 用于操作数据库的模型
const { UserE5Post } = require('../models/index');
// 自定义错误对象
const { ClientError, ServerError } = require('./errors/index');
// 已定义的业务操作
const { findOneUserById } = require('./userService');
// 配置文件 用户状态配置
const { accountStatusConfig } = require('../config');

async function findE5PostById(e5id) {
  // 通过e5id获取UserE5Post
  const e5Post = await UserE5Post.findOne({
    where: { user_id: e5id },
  });
  // 未找到则抛出错误
  if (!e5Post) {
    throw new ClientError('用户不存在');
  }
  return e5Post;
}

// 确认访问动态权限
function confirmPostAccessPermission(id, e5user) {
  // 当前e5账号主状态非正在分享 则无权发送动态
  if (e5user.account_status !== accountStatusConfig.sharing) {
    throw new ClientError('e5账号主未在分享');
  }
  // 如果用户非当前e5账号主 并且 未被当前e5账号主帮助，则无权发送动态
  if (id !== e5user.id
    && !JSON.parse(e5user.helping_users).includes(id)) {
    throw new ClientError('无权访问动态');
  }
}

// 获取e5动态信息
async function getPosts(id, e5id) {
  // 对于获取，或许可以不验证用户的权限
  // 获取UserE5Post并返回posts字段
  const e5Post = await findE5PostById(e5id);
  return e5Post.posts;
}

// 发送e5动态帖子
async function sendPost(id, e5id, content) {
  // 获取e5账号主信息
  const e5user = await findOneUserById(e5id);

  // 确认访问动态权限
  confirmPostAccessPermission(id, e5user);

  // 通过e5id获取UserE5Post
  const e5Post = await findE5PostById(e5id);
  let posts;
  try {
    // 从字符串解析为帖子对象数组
    posts = JSON.parse(e5Post.posts);
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('动态列表损坏');
  }

  // 定义新的帖子对象
  const newPost = {
    id: uuidv4(),
    userId: id,
    content,
    time: new Date(),
  };
    // 将帖子对象添加入数组尾部
  posts.push(newPost);

  try {
    // 更新数据
    e5Post.posts = JSON.stringify(posts);
    await e5Post.save();
    // 返回更新后的数据
    return e5Post.posts;
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('发送帖子失败');
  }
}

// 删除e5动态帖子
async function deletePost(id, e5id, uuid) {
  // 获取e5账号主信息
  const e5user = await findOneUserById(e5id);

  // 确认访问动态权限
  confirmPostAccessPermission(id, e5user);

  // 通过e5id获取UserE5Post
  const e5Post = await findE5PostById(e5id);
  let posts;
  try {
    // 从字符串解析为帖子对象数组
    posts = JSON.parse(e5Post.posts);
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('动态列表损坏');
  }

  // 找到id为参数uuid的帖子
  const index = posts.findIndex((post) => post.id === uuid);
  // 如果找不到对应uuid的帖子，抛出客户端错误
  if (index === -1) {
    throw new ClientError('未找到对应的帖子');
  }
  // 判断当前用户是否与帖子的user_id对应，或为e5帐号主
  if (posts[index].userId !== id && id !== e5user.id) {
    throw new ClientError('无权删除该帖子');
  }
  // 删除
  posts.splice(index, 1);

  try {
    // 更新数据
    e5Post.posts = JSON.stringify(posts);
    await e5Post.save();
    // 返回更新后的数据
    return e5Post.posts;
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('删除帖子失败');
  }
}

// 清空e5动态
async function clearPosts(id) {
  // 获取e5账号主信息（自己）
  const e5user = await findOneUserById(id);

  // 确认访问动态权限
  confirmPostAccessPermission(id, e5user);

  // 通过id获取UserE5Post
  const e5Post = await findE5PostById(id);

  // 清空
  e5Post.posts = '[]';
  try {
    // 更新数据
    await e5Post.save();
    // 返回更新后的数据
    return e5Post.posts;
  } catch (error) {
    // 如果发生错误，抛出客户端错误
    throw new ServerError('清空动态失败');
  }
}

module.exports = {
  // 接口对应的业务操作
  getPosts,
  sendPost,
  deletePost,
  clearPosts,
  // 以下为在其他业务操作中使用的方法
  findE5PostById,
};
