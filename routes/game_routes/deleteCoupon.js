const Coupon = require('/Users/paritamakvana/Desktop/MyPlayMania/PlayMania-Backened/models/coupon.js');
const sequelize = require('/Users/paritamakvana/Desktop/MyPlayMania/PlayMania-Backened/config/db.js');

const deleteCoupon = async (req, res) => {
  try {
    let coupon_id = req.params.categoryID;
    sequelize.sync().then((result) => {
      return Coupon.destroy({
        where: {
          coupon_id: coupon_id,
        },
      });
    });
    res.status(200).json({
      message: 'Coupon deleted succesfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete coupon.' });
  }
};

module.exports = deleteCoupon;
