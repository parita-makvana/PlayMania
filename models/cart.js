const Sequelize = require('sequelize');
const sequelize = require('../config/db');
const User = require('/Users/paritamakvana/Desktop/MyPlayMania/PlayMania-Backened/models/user.js');
const Game = require('/Users/paritamakvana/Desktop/MyPlayMania/PlayMania-Backened/models/game.js');

const Cart = sequelize.define('cart', {
  cart_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
    allowNull: false,
    primaryKey: true,
  },
  user_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
  },
  game_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
  },
});

Game.hasMany(Cart, {
  foreignKey: {
    name: 'game_id_fk',
    field: 'game_id',
  },
});

Cart.belongsTo(Game, {
  foreignKey: {
    name: 'game_id_fk',
    field: 'game_id',
  },
});

User.hasMany(Cart, {
  foreignKey: {
    name: 'user_id_fk',
    field: 'user_id',
  },
});

Cart.belongsTo(User, {
  foreignKey: {
    name: 'user_id_fk',
    field: 'user_id',
  },
});

module.exports = Cart;
