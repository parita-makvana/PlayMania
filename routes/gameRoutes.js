const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const gameController = require('../controllers/gameController');

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname);
    callback(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({ storage });

// .............. Routes calling controllers...........

// ------ To add GAME CATEGORY ----------------
router.post('/game_category', gameController.addCategory);

// ---------- To get all categories -----------
router.get('/all_categories', gameController.getAllCategory);

// ---------- To delete category -----------
router.delete('/category/:categoryID', gameController.deleteCategory);

//---------- TO ADD GAME --------------
router.post('/:userID', upload.single('image'), gameController.addGame);

// //---------- To delete game ----------
// router.delete('/:gameID', gameController.deleteGame);

// ------------------ To get all games using Cursor Pagenation... cursor encoding DONE ------------------
router.get('/allGames/:limit/:cursor', gameController.getAllGames);

//----------------To add coupons-------------------
router.post('/game_coupon/:gameID', gameController.addCoupon);

//----------------To delete coupon-------------------
router.delete('/game_coupon/:gameID', gameController.deleteCoupon);

// // Add to cart
// app.route('/addToCart/:userID').post(addToCart);

// // To remove game from cart
// app.route('/deleteFromCart/:userID/:gameID').delete(deleteFromCart);

// // To purchase game...Transaction..remaining
// app.route('/checkout/:userID').post(checkout);

module.exports = router;
