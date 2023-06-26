const Sequelize = require('sequelize');
const sequelize = require('../config/db');

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

module.exports = Coupon;
