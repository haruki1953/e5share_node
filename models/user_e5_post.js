// models/user_e5_post.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/index');
const User = require('./user');

const UserE5Post = sequelize.define('user_e5_post', {
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
  posts: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: '[]',
  },
}, {
  tableName: 'user_e5_post',
});

module.exports = UserE5Post;
