// Add to cart

const { v4: uuidv4 } = require('uuid');
const Cart = require('../../models/cart');
const sequelize = require('../../config/database');

const addToCart = async (req, res) => {
  try {
    const user_id = req.params.userID;
    const { game_id } = req.body;
    const cart_id = uuidv4();

    //-----VALIDATIONS-----------
    if (!user_id) {
      return res.send({
        success: false,
        message: 'important fields empty',
        errors: [
          {
            field: 'user_id',
            message: 'This field cannot be empty',
          },
        ],
      });
    } else if (!game_id) {
      return res.send({
        success: false,
        message: 'important field empty',
        errors: [
          {
            field: 'game_id',
            message: 'This field cannot be empty',
          },
        ],
      });
    }

    sequelize.sync({ force: false }).then((result) => {
      //console.log(result);
      return Cart.create({
        cart_id: cart_id,
        user_id: user_id,
        game_id: game_id,
      });
    });

    res.status(200).json({ message: 'Added to cart !!' });
  } catch (error) {
    console.error('Error while adding to cart, try again....', error);
    res.status(500).json({ message: 'Internal Server Error..' });
  }
};

module.exports = addToCart;
