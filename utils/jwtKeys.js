const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// 生成随机密钥
function generateRandomKey() {
  return crypto.randomBytes(32).toString('base64');
}

// 读取或生成 JWT 密钥并保存到文件中
function initializeJwtKeys(filePath) {
  let jwtSecretKey;
  let adminSecretKey;

  try {
    // 尝试从文件中读取密钥
    const keys = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!keys.jwtSecretKey || !keys.adminSecretKey) throw new Error();
    jwtSecretKey = keys.jwtSecretKey;
    adminSecretKey = keys.adminSecretKey;
  } catch (err) {
    // 如果文件不存在或者读取失败，则生成新的密钥
    jwtSecretKey = generateRandomKey();
    adminSecretKey = generateRandomKey();

    // 将新生成的密钥保存到文件中
    fs.writeFileSync(filePath, JSON.stringify({ jwtSecretKey, adminSecretKey }), 'utf8');
  }

  return { jwtSecretKey, adminSecretKey };
}

const jwtKeys = initializeJwtKeys(path.join(__dirname, 'jwtKeys.json'));
// 导出 JWT 密钥
exports.jwtSecretKey = jwtKeys.jwtSecretKey;
exports.adminSecretKey = jwtKeys.adminSecretKey;
