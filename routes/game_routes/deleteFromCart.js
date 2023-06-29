const Cart = require('../../models/cart');
const sequelize = require('../../config/database');

const deleteFromCart = async (req, res) => {
  try {
    let user_id = req.params.userID;
    let game_id = req.params.gameID;
    sequelize.sync().then((result) => {
      return Cart.destroy({
        where: {
          user_id: user_id,
          game_id: game_id,
        },
      });
    });
    res.status(200).json({
      message: 'Removed from cart!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove from cart.' });
  }
};

module.exports = deleteFromCart;
