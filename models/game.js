const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Game = sequelize.define('game', {
  game_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
    allowNull: false,
    primaryKey: true,
  },
  game_name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  game_description: {
    type: Sequelize.STRING(500),
    allowNull: false,
  },
  game_size: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  game_type: {
    type: Sequelize.ENUM('free', 'paid'),
    allowNull: false,
  },
  price: {
    type: Sequelize.FLOAT,
  },
  user_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
    primaryKey: false,
  },
  category_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
    primaryKey: false,
  },
  average_rating: {
    type: Sequelize.FLOAT,
  },
  game_image: {
    type: Sequelize.BLOB('long'),
  },
});

module.exports = Game;
