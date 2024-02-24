// models/admin.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/index');

const Admin = sequelize.define('admin', {
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
  level: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'admin',
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  note: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'admin',
});

module.exports = Admin;
