// Importing modules
const express = require('express');
//const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// from ORM //PARENT --hasmany-- CHILD FK
// const User = require('./models/user');
// const Game = require('./models/game');
// const Category = require('./models/category');
// const Coupon = require('./models/coupon');
//const sequelize = require('./config/database');

//CONNECTION
// sequelize
//   .sync({ force: false }) // .sync({force:true})
//   .then((result) => {
//     // console.log(result);
//   })
//   .catch((err) => {
//     // console.log(err);
//   });

//to get the access of environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// // orm
// const { v4: uuidv4 } = require('uuid');

// router
const router = express.Router();

// ************** Game code refactoring **************
const addCategory = require('./routes/game_routes/addCategory');
const getAllCategory = require('./routes/game_routes/getAllCategory');
const deleteCategory = require('./routes/game_routes/deleteCategory');
const addGame = require('./routes/game_routes/addGame');
//const getAllGames = require('./routes/game_routes/getAllGames');
const deleteGame = require('./routes/game_routes/deleteGame');
const addCoupon = require('./routes/game_routes/addCoupon');
const deleteCoupon = require('./routes/game_routes/deleteCoupon');
const addToCart = require('./routes/game_routes/addToCart');
const deleteFromCart = require('./routes/game_routes/deleteFromCart');
const checkout = require('./routes/game_routes/checkout');
const getAllGamesUsingCursor = require('./routes/game_routes/allGamesUsingCursor');

// ************** GAME **************
// ----------------------------------

// ------ To add GAME CATEGORY ----------------
app.route('/game_category').post(addCategory);

// ---------- To get all categories -----------
app.route('/api/all_categories').get(getAllCategory);

// ---------- To delete category -----------
app.route('/api/delete/category/:categoryID').delete(deleteCategory);

// ---------- TO ADD GAME --------------
app.route('/game/:userID').post(addGame);

//---------- To delete game ----------
app.route('/api/delete/game/:gameID').delete(deleteGame);

// ------------------ To get all games using Cursor Pagenation... cursor encoding DONE ------------------
//app.route('/allGames').get(getAllGames);
app.route('/allGames/:limit/:cursor').get(getAllGamesUsingCursor);

//----------------To add coupons-------------------
app.route('/game_coupon/:gameID').post(addCoupon);

//----------------To delete coupons-------------------
app.route('/game_coupon/:gameID').delete(deleteCoupon);

// Add to cart
app.route('/addToCart/:userID').post(addToCart);

// To remove game from cart
app.route('/deleteFromCart/:userID/:gameID').delete(deleteFromCart);

// To purchase game...Transaction..remaining
app.route('/checkout/:userID').post(checkout);

// to start the server
app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});
