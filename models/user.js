// models/user.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/index');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  nickname: {
    type: DataTypes.STRING(50),
  },
  avatar: {
    type: DataTypes.STRING(255),
  },
  contact_info: {
    type: DataTypes.TEXT,
  },
  bio: {
    type: DataTypes.TEXT,
  },
  registered_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  account_status: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'active',
  },
  e5_subscription_date: {
    type: DataTypes.DATE,
  },
  e5_expiration_date: {
    type: DataTypes.DATE,
  },
  helping_users: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  helped_users: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  helping_by_users: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  helped_by_users: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
  },
  note: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'user',
});

module.exports = User;
