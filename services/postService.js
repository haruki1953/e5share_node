// 用于生成帖子的uuid
const { v4: uuidv4 } = require('uuid');

// 自定义错误对象
const { ClientError } = require('./errors/index');
// 数据模块
const {
  findOneUserById,
  findE5PostById,
  getPosts,
  savePosts,
} = require('./dataService');
// 配置文件 用户状态配置
const { accountStatus } = require('../config');

// 确认访问动态权限
async function confirmPostAccessPermission(id, e5id) {
  // 获取e5账号主信息
  const e5user = await findOneUserById(e5id);

  // 当前e5账号主状态非正在分享 则无权发送动态
  if (e5user.account_status !== accountStatus.sharing) {
    throw new ClientError('e5账号主未在分享');
  }
  // 如果用户非当前e5账号主 并且 未被当前e5账号主帮助，则无权发送动态
  if (id !== e5user.id
    && !JSON.parse(e5user.helping_users).includes(id)) {
    throw new ClientError('无权访问动态');
  }
}

// 获取e5动态信息
async function getE5Posts(id, e5id) {
  // 对于获取，或许可以不验证用户的权限
  // 获取UserE5Post并返回posts字段，直接返回字符串，在前端解析，减小后端压力（
  const e5Post = await findE5PostById(e5id);
  return e5Post.posts;
}

// 发送e5动态帖子
async function sendE5Post(id, e5id, content) {
  // 确认访问动态权限
  await confirmPostAccessPermission(id, e5id);

  // 通过e5id获取UserE5Post
  const posts = await getPosts(e5id);

  // 定义新的帖子对象
  const newPost = {
    id: uuidv4(),
    userId: id,
    content,
    time: new Date(),
  };
  // 将帖子对象添加入数组尾部
  posts.push(newPost);

  // 保存
  await savePosts(e5id, posts);
  // 返回
  return posts;
}

// 删除e5动态帖子
async function deleteE5Post(id, e5id, uuid) {
  // 确认访问动态权限
  await confirmPostAccessPermission(id, e5id);

  // 通过e5id获取UserE5Post
  const posts = await getPosts(e5id);

  // 找到id为参数uuid的帖子
  const index = posts.findIndex((post) => post.id === uuid);
  // 如果找不到对应uuid的帖子，抛出客户端错误
  if (index === -1) {
    throw new ClientError('未找到对应的帖子');
  }
  // 判断当前用户是否与帖子的user_id对应，或为e5帐号主
  if (posts[index].userId !== id && id !== e5id) {
    throw new ClientError('无权删除该帖子');
  }
  // 删除
  posts.splice(index, 1);

  // 保存
  await savePosts(e5id, posts);
  // 返回
  return posts;
}

// 清空e5动态
async function clearE5Posts(id) {
  // 确认访问动态权限
  await confirmPostAccessPermission(id, id);
  // 清空
  await savePosts(id, []);
}

module.exports = {
  // 接口对应的业务操作
  getE5Posts,
  sendE5Post,
  deleteE5Post,
  clearE5Posts,
};
