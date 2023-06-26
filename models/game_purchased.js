const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Game = require('../models/game');
const User = require('../models/user');

const Game_purchased = sequelize.define('game_purchased', {
  transaction_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
    allowNull: false,
    primaryKey: true,
  },

  user_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
    primaryKey: false,
  },
  game_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
    primaryKey: false,
  },
  amount_paid: {
    type: Sequelize.FLOAT,
  },
});

Game.hasMany(Game_purchased, {
  foreignKey: {
    name: 'game_id_fk',
    field: 'game_id',
  },
});

Game_purchased.belongsTo(Game, {
  foreignKey: {
    name: 'game_id_fk',
    field: 'game_id',
  },
});

User.hasMany(Game_purchased, {
  foreignKey: {
    name: 'user_id_fk',
    field: 'user_id',
  },
});

Game_purchased.belongsTo(User, {
  foreignKey: {
    name: 'user_id_fk',
    field: 'user_id',
  },
});

module.exports = Game_purchased;
