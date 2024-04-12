const fs = require('fs');
const path = require('path');
const { ServerError } = require('../services/errors/index');

let adminConfig = {};

const configPath = path.join(__dirname, 'config.json');
// 从 config.json 文件加载数据
const loadConfigData = () => {
  const data = fs.readFileSync(configPath, 'utf8');
  adminConfig = JSON.parse(data);
  // 检查是否缺少属性
  if (!Object.prototype.hasOwnProperty.call(adminConfig, 'username')
    || !Object.prototype.hasOwnProperty.call(adminConfig, 'password')
    || !Object.prototype.hasOwnProperty.call(adminConfig, 'couldRegister')) {
    throw new ServerError('/admin/config.json 损坏');
  }
};
loadConfigData();

// 将数据保存回 config.json 文件
function saveConfigData(configData) {
  const data = JSON.stringify(configData, null, 2);
  fs.writeFileSync(configPath, data, 'utf8');
}

const getAdminConfig = () => ({ ...adminConfig });
const getAdminUsername = () => adminConfig.username;
const getAdminPassword = () => adminConfig.password;
const getCouldRegister = () => adminConfig.couldRegister;

const updateAdminAuth = (username, password) => {
  adminConfig.username = username;
  adminConfig.password = password;
  saveConfigData(adminConfig);
  loadConfigData();
};

const updateAdminInfo = (couldRegister) => {
  adminConfig.couldRegister = couldRegister;
  saveConfigData(adminConfig);
  loadConfigData();
};

module.exports = {
  getAdminConfig,
  getAdminUsername,
  getAdminPassword,
  getCouldRegister,
  updateAdminAuth,
  updateAdminInfo,
};
