const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const Game = require('../models/game');

const Coupon = sequelize.define('coupon', {
  coupon_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
    allowNull: false,
    primaryKey: true,
  },
  game_id: {
    type: Sequelize.UUID,
    autoIncrement: false,
  },
  coupon_title: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  coupon_discription: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  coupon_discount: {
    type: Sequelize.INTEGER,
  },
});

Game.hasMany(Coupon, {
  foreignKey: {
    name: 'game_id_fk',
    field: 'game_id',
  },
});
Coupon.belongsTo(Game, {
  foreignKey: {
    name: 'game_id_fk',
    field: 'game_id',
  },
});

module.exports = Coupon;
