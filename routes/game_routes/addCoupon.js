const { v4: uuidv4 } = require('uuid');
const Coupon = require('../../models/coupon');
const sequelize = require('../../config/database.js');

const addCoupon = async (req, res) => {
  try {
    const game_id = req.params.gameID;
    const { coupon_title, coupon_discription, coupon_discount } = req.body;
    const coupon_id = uuidv4();

    //-----VALIDATIONS-----------
    if (!coupon_title) {
      return res.send({
        success: false,
        message: 'important fields empty',
        errors: [
          {
            field: 'coupon_title',
            message: 'This field cannot be empty',
          },
        ],
      });
    } else if (!coupon_discription) {
      return res.send({
        success: false,
        message: 'important field empty',
        errors: [
          {
            field: 'coupon_discription',
            message: 'This field cannot be empty',
          },
        ],
      });
    } else if (!coupon_discount) {
      return res.send({
        success: false,
        message: 'important field empty',
        errors: [
          {
            field: 'coupon_discount',
            message: 'This field cannot be empty',
          },
        ],
      });
    }

    sequelize
      // .sync({ force: true })
      .sync()
      .then((result) => {
        //console.log(result);

        return Coupon.create({
          coupon_id: coupon_id,
          game_id: game_id,
          coupon_title: coupon_title,
          coupon_discription: coupon_discription,
          coupon_discount: coupon_discount,
        });
      });

    res.status(200).json({ message: 'Coupon created successfully!' });
  } catch (error) {
    console.error('Error while registering game coupon, try again....', error);
    res.status(500).json({ message: 'Internal Server Error..' });
  }
};

module.exports = addCoupon;
