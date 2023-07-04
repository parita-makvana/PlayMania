const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Game = require('../models/game');
const User = require('../models/user');

const gamePurchased = sequelize.define('gamePurchased ', {
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

Game.hasMany(gamePurchased, {
  foreignKey: {
    name: 'game_id_fk',
    field: 'game_id',
  },
});

gamePurchased.belongsTo(Game, {
  foreignKey: {
    name: 'game_id_fk',
    field: 'game_id',
  },
});

User.hasMany(gamePurchased, {
  foreignKey: {
    name: 'user_id_fk',
    field: 'user_id',
  },
});

gamePurchased.belongsTo(User, {
  foreignKey: {
    name: 'user_id_fk',
    field: 'user_id',
  },
});

module.exports = gamePurchased;
