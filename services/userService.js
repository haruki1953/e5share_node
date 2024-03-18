const fs = require('fs').promises;
const path = require('path');
// 图片处理模块
const sharp = require('sharp');
// 密码加密
const bcrypt = require('bcryptjs');
// 日期解析
const moment = require('moment');

// 导入配置文件
const { avatarConfig } = require('../config');
// 用于操作数据库的模型
const { User } = require('../models/index');
// 自定义错误对象
const { ClientError, ServerError } = require('./errors/index');
// 已定义的业务操作
const { confirmEmailNotExists, confirmUserPassword } = require('./authService');

// 数据模块
const {
  findOneUserById,
  findNotificationById,
} = require('./dataService');

// 修改最后登录时间
async function updateLastLoginTime(id) {
  try {
    // 更新最后登录时间为当前时间
    await User.update({ last_login: new Date() }, { where: { id } });
  } catch (error) {
    throw new ClientError('更新最后登录时间失败');
  }
}

// 获取个人信息
async function getProfile(id) {
  // 根据id查找用户
  const user = await findOneUserById(id);

  // 获取用户通知，直接返回字符串，在前端解析通知，减小后端压力（
  const userNotification = await findNotificationById(id);

  // 修改最后登录时间，在查询后再修改，这样前端可以获取到上次登录的时间
  await updateLastLoginTime(id);

  // 整理返回数据
  const data = {
    id: user.id,
    username: user.username,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    contact_info: user.contact_info,
    bio: user.bio,
    registered_at: user.registered_at,
    last_login: user.last_login,
    account_status: user.account_status,
    e5_subscription_date: user.e5_subscription_date,
    e5_expiration_date: user.e5_expiration_date,
    helping_users: user.helping_users,
    helped_users: user.helped_users,
    helping_by_users: user.helping_by_users,
    helped_by_users: user.helped_by_users,
    notifications: userNotification.notifications,
  };

  return data;
}

// 修改基本信息
async function updateProfile(id, nickname, contactInfo, bio) {
// 根据 id 查找用户
  const user = await findOneUserById(id);
  // 更新昵称、联系信息和简介
  user.nickname = nickname;
  user.contact_info = contactInfo;
  user.bio = bio;
  try {
    // 保存更新后的用户信息到数据库
    await user.save();
  } catch (error) {
    // 捕获并处理任何错误
    throw new ServerError('保存失败');
  }
  return user;
}

// 确保保存文件的文件夹存在
async function confirmSaveFolderExists(dirPath) {
  try {
    // 检查文件夹是否存在
    await fs.access(dirPath);
  } catch (error) {
    // 如果文件夹不存在，创建文件夹
    if (error.code === 'ENOENT') {
      await fs.mkdir(dirPath, { recursive: true });
    } else {
      throw new ServerError('保存目录错误');
    }
  }
}

// 处理头像的函数，只需传入文件名
async function processAvatar(filename) {
  // 输入文件
  const inputFilePath = path.join(avatarConfig.uploadPath, filename);
  // 保存文件 拼接.jpg
  const saveFileName = `${filename}.jpg`;
  const saveFilePath = path.join(avatarConfig.savePath, saveFileName);
  try {
    // 读取输入图片文件
    const inputBuffer = await fs.readFile(inputFilePath);

    // 使用 sharp 库处理图片
    const outputBuffer = await sharp(inputBuffer)
      .resize(avatarConfig.size, avatarConfig.size, { fit: 'cover' }) // 调整为 256x256 的正方形
      .jpeg({ quality: avatarConfig.quality }) // 设置 JPEG 图片质量
      .toBuffer(); // 转换为 Buffer

    // 确保保存目录存在
    await confirmSaveFolderExists(avatarConfig.savePath);
    // 将处理后的图片数据写入到输出文件中
    await fs.writeFile(saveFilePath, outputBuffer);

    // 删除原始图片
    fs.unlink(inputFilePath).catch(() => {});

    // 返回保存的文件名
    return saveFileName;
  } catch (error) {
    // 出现错误则删除全部文件
    fs.unlink(inputFilePath).catch(() => {}); // 删除输入文件
    fs.unlink(saveFilePath).catch(() => {}); // 删除输出文件
    throw new ClientError('图片处理失败');
  }
}

// 修改头像
async function updateAvatar(id, filename) {
  // 处理头像
  const avatar = await processAvatar(filename);

  // 获取用户
  const user = await findOneUserById(id);
  // 删除旧头像文件
  if (user.avatar) {
    fs.unlink(path.join(avatarConfig.savePath, user.avatar)).catch(() => {});
  }

  // 保存新头像
  user.avatar = avatar;
  try {
    // 保存更新后的用户信息到数据库
    await user.save();
  } catch (error) {
    // 捕获并处理任何错误
    throw new ServerError('保存失败');
  }
  return user;
}

// 修改邮箱
async function updateEmail(id, email) {
  // 确认邮箱未被使用
  await confirmEmailNotExists(email);

  // 获取用户
  const user = await findOneUserById(id);
  // 修改邮箱
  user.email = email;
  try {
    // 保存更新后的用户信息到数据库
    await user.save();
  } catch (error) {
    // 捕获并处理任何错误
    throw new ServerError('保存失败');
  }
  return user;
}

// 修改密码
async function updatePassword(id, oldPassword, newPassword) {
  // 获取用户
  const user = await findOneUserById(id);

  // 确认密码正确
  await confirmUserPassword(user, oldPassword);

  // 修改密码 密码加密
  user.password_hash = bcrypt.hashSync(newPassword, 10);
  try {
    // 保存更新后的用户信息到数据库
    await user.save();
  } catch (error) {
    // 捕获并处理任何错误
    throw new ServerError('保存失败');
  }
  return user;
}

// 修改e5订阅信息
async function updateE5info(id, subscriptionDate, expirationDate) {
  // 将字符串转为日期
  const subDate = moment.tz(subscriptionDate, 'Asia/Shanghai').utc();
  const expDate = moment.tz(expirationDate, 'Asia/Shanghai').utc();

  // 检查日期对象是否有效
  if (!subDate.isValid() || !expDate.isValid()) {
    throw new ClientError('日期无效');
  }
  // 检查 expDate 是否早于 subDate
  if (expDate < subDate) {
    throw new ClientError('到期日期不能早于订阅日期');
  }
  // 不能为同一天
  if (subscriptionDate === expirationDate) {
    throw new ClientError('到期日期与订阅日期不能是同一天');
  }

  // 获取用户
  const user = await findOneUserById(id);
  // 修改e5订阅信息
  user.e5_subscription_date = subDate.toDate();
  user.e5_expiration_date = expDate.toDate();
  try {
    // 保存更新后的用户信息到数据库
    await user.save();
  } catch (error) {
    // 捕获并处理任何错误
    throw new ServerError('保存失败');
  }
  return user;
}

module.exports = {
  // 接口对应的业务操作
  getProfile,
  updateProfile,
  updateAvatar,
  updateEmail,
  updatePassword,
  updateE5info,
};
