// const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const { dbConfig } = require('../config');

// 解析备份文件名，获取备份类型
const getBackupTypeFromFileName = (fileName) => {
  const parts = fileName.split('.');
  // 倒数第一个后缀为备份类型
  return parts[parts.length - 1];
};

// 解析备份文件名，获取时间戳
const getTimeFromFileName = (fileName) => {
  const parts = fileName.split('.');
  // 倒数第二个后缀为备份时间
  const timestampString = parts[parts.length - 2];
  return parseInt(timestampString, 10);
};

// 删除多余的备份文件
const deleteExcessBackups = (backupList, maxBackups) => {
  if (backupList.length > maxBackups) {
    const backupsToDelete = backupList.slice(maxBackups);
    backupsToDelete.forEach((backup) => {
      const filePath = path.join(dbConfig.backupPath, backup);
      fs.unlinkSync(filePath);
    });
  }
};

// 限制备份文件个数
const limitBackupFiles = () => {
  // 获取备份文件夹中的所有文件列表
  const files = fs.readdirSync(dbConfig.backupPath);

  // 对文件列表进行排序，确保最新的备份文件排在最前面
  files.sort((a, b) => {
    const timeA = getTimeFromFileName(a);
    const timeB = getTimeFromFileName(b);
    return timeB - timeA; // 降序排列
  });

  // 启动时备份文件列表
  const startupBackupList = [];
  // 每日备份文件列表
  const dailyBackupList = [];
  // 每月备份文件列表
  const monthlyBackupList = [];

  // 遍历文件列表
  files.forEach((file) => {
    const backupType = getBackupTypeFromFileName(file);

    switch (backupType) {
      case dbConfig.backupType.StartupBackup:
        startupBackupList.push(file);
        break;
      case dbConfig.backupType.DailyBackup:
        dailyBackupList.push(file);
        break;
      case dbConfig.backupType.MonthlyBackup:
        monthlyBackupList.push(file);
        break;
      default:
        break;
    }
  });
  // 删除多余的备份
  deleteExcessBackups(startupBackupList, dbConfig.backupMaxNum.StartupBackup);
  deleteExcessBackups(dailyBackupList, dbConfig.backupMaxNum.DailyBackup);
  deleteExcessBackups(monthlyBackupList, dbConfig.backupMaxNum.MonthlyBackup);
};

// 定义备份任务
const backupDatabase = (backupType) => {
  // SQLite数据库文件路径
  const databasePath = dbConfig.dbfile;
  // 备份目录路径
  const backupDir = dbConfig.backupPath;

  // 数据库文件不存在则返回
  if (!fs.existsSync(databasePath)) {
    return;
  }

  // 创建备份目录（如果不存在）
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }

  // 备份文件名
  const dateTime = new Date().toISOString().replace(/[^\d]/g, '');
  const backupFileName = `${dbConfig.dbName}.${dateTime}.${backupType}`;
  const backupFilePath = path.join(backupDir, backupFileName);

  // 复制数据库文件以进行备份
  fs.copyFileSync(databasePath, backupFilePath);
  // 限制备份文件数量
  limitBackupFiles();
};

// 启动时备份
const startupBackupDataBase = async () => {
  backupDatabase(dbConfig.backupType.StartupBackup);
};

// 导出 启动时备份方法，在初始化数据库之前调用
module.exports = {
  startupBackupDataBase,
};
