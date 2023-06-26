const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('category', {
  category_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
    allowNull: false,
    primaryKey: true,
  },
  user_age_limit: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  category_name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  category_description: {
    type: Sequelize.STRING(500),
    allowNull: false,
  },
});

module.exports = Category;
