// models/users_e5_shared_info.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/index');
const User = require('./user');

const UsersE5SharedInfo = sequelize.define('users_e5_shared_info', {
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
  shared_info: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
  },
}, {
  tableName: 'user_e5_shared_info',
});

module.exports = UsersE5SharedInfo;
