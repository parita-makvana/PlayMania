const Sequelize = require('sequelize');
const sequelize = require('/Users/diptisharma/Desktop/PlayMania/config/database.js');

const User = sequelize.define('user', {
  user_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  dob: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  hashed_password: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  role: {
    type: Sequelize.ENUM('buyer', 'seller'),
  },
  resetLink:{
    type: Sequelize.STRING,
  }
});

module.exports = User;