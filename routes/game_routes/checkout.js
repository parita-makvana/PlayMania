const Game_purchased = require('../../models/game_purchased');
const Game = require('../../models/game');
const Coupon = require('../../models/coupon');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../../config/database');

const checkout = async (req, res) => {
  const { game_id } = req.body;
  const user_id = req.params.userID;

  const couponDiscount = 0,
    price = 0;
  const trans_id = uuidv4();

  try {
    const game = await Game.findOne({
      raw: true,
      where: { game_id: game_id },
    });
    game_type = game.game_type;

    if (game_type == 'free') {
      res.status(200).json({ message: 'Game installed successfully!' });
    } else if (game_type == 'paid') {
      price = game.price;
      try {
        const coupon = await Coupon.findOne({
          raw: true,
          where: { game_id: game_id },
        });
        couponDiscount = coupon.coupon_discount;
      } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Coupon Not Found!' });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Game not found' });
  }

  const amount = price * (1 - couponDiscount / 100);

  try {
    sequelize.sync().then((result) => {
      //console.log(result);
      return Game_purchased.create({
        transaction_id: trans_id,
        user_id: user_id,
        game_id: game_id,
        amount_paid: amount,
      });
    });
    res
      .status(200)
      .json({ message: 'Game purchased successfully!', amount_paid: amount });
  } catch (error) {
    console.error('Error while purchasing game, try again....', error);
    res.status(500).json({ message: 'Internal Server Error..' });
  }
};

module.exports = checkout;

//after checkout remove that game from cart pending
