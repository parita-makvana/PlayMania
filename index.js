// Importing modules
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// from ORM
const User = require('./models/user');
const Game = require('./models/game');
const Category = require('./models/category');
const Coupon = require('./models/coupon');
const sequelize = require('./config/database');

//PARENT --hasmany-- CHILD FK
User.hasMany(Game, {
  foreignKey: {
    name: 'user_id_fk',
    field: 'user_id',
  },
});

Game.belongsTo(User, {
  foreignKey: {
    name: 'user_id_fk',
    field: 'user_id',
  },
});

Category.hasMany(Game, {
  foreignKey: {
    name: 'category_id_fk',
    field: 'category_id',
  },
});

Game.belongsTo(Category, {
  foreignKey: {
    name: 'category_id_fk',
    field: 'category_id',
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

//CONNECTION
sequelize
  .sync() // .sync({force:true})
  .then((result) => {
    // console.log(result);
  })
  .catch((err) => {
    // console.log(err);
  });

// to get the jwtwebtoken
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwtTokens = require('./utils/jwt-helpers');
const cookieParser = require('cookie-parser');
const corsOptions = { credentials: true, origin: '*' };

// FOR FORGOT PASSWORD AND RESET LINK
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
//
const sendGridKey = process.env.SENDGRID_KEY;
const resetSecret = process.env.RESET_SECRET;

// importing the functions for forgot password and reset link
const sendMail = require('./utils/sendMail');
const { filterBy, update } = require('./utils/filterBy');
// const update = require('/Users/diptisharma/Desktop/PlayMania/utils/filterBy.js')

// FOR AUTHENTICATION
const authenticateToken = require('./middleware/authorization');
// for signup
const isUserAuth = require('./middleware/isUserAuth');
// for role specific
const userRole = require('./middleware/userRoles');

//to get the access of environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// changes from here for JWT
app.use(cors(corsOptions));
app.use(cookieParser());

// orm
const { v4: uuidv4 } = require('uuid');

// router
const router = express.Router();

// Refacotred code
const getAllUsers = require('./routes/user_routes/getAllUsers');
const userLogin = require('./routes/user_routes/userLogin');
const userLogout = require('./routes/user_routes/userLogout');
const newUserRegistration = require('./routes/user_routes/newUserRegistration');
const forgotPassword = require('./routes/user_routes/forgotPassword');
const refreshToken = require('./routes/user_routes/refreshToken');
const updatePassword = require('./routes/user_routes/updatePassword');

// ************** Game code refactoring **************
const addCategory = require('./routes/game_routes/addCategory');
const getAllCategory = require('./routes/game_routes/getAllCategory');
const deleteCategory = require('./routes/game_routes/deleteCategory');
const addGame = require('./routes/game_routes/addGame');
const getAllGames = require('./routes/game_routes/getAllGames');
const deleteGame = require('./routes/game_routes/deleteGame');
const addCoupon = require('./routes/game_routes/addCoupon');
const deleteCoupon = require('./routes/game_routes/deleteCoupon');
const addToCart = require('./routes/game_routes/addToCart');
const deleteFromCart = require('./routes/game_routes/deleteFromCart');
const checkout = require('./routes/game_routes/checkout');

// -----------------FOR ADMIN: TO GET ALL THE USERS---------------
app.route('/users').get(isUserAuth, getAllUsers);

// ----------------FOR LOGIN----------------------
app.route('/login').post(userLogin);
// ---- USER SPECIFIC-------

//------------FOR LOGOUT----------------------------
app.route('/logout').delete(userLogout);

//--------- FOR REGISTERING NEW USER----------------------
app.route('/register').post(newUserRegistration);

// ---FORGOT PASSWORD-----
app.route('/forgot-password').patch(forgotPassword);

//------- UPDATING NEW PASSWORD ---------
app.route('/reset-password/:token').patch(updatePassword);

// -----------TO GET THE REFRESH TOKEN---------------
app.route('/refresh_token').get(refreshToken);

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

// ------------------ To get all games using Cursor Pagenation... cursor encoding remaining ------------------
app.route('/allGames').get(getAllGames);

//----------------To add coupons-------------------
app.route('/game_coupon/:gameID').post(addCoupon);

//----------------To delete coupons-------------------
app.route('/game_coupon/:gameID').delete(deleteCoupon);

// Add to cart
app.route('/addToCart/:userID').post(addToCart);

// To remove game from cart
app.route('/deleteFromCart/:userID/:gameID').delete(deleteFromCart);

// To purchase game...Transaction..remaining
//app.route('/checkout/:userID').post(checkout);

// to start the server
app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});
