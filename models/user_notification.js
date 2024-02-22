// models/user_notification.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/index');
const User = require('./user');

const UserNotification = sequelize.define('user_notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  notifications: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
  },
}, {
  tableName: 'user_notification',
});

module.exports = UserNotification;
