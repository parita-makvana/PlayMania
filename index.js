// Importing modules
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// from ORM
const User = require('/Users/diptisharma/Desktop/PlayMania/models/user.js');
const Game = require('./models/game');
const Category = require('./models/category');
const Coupon = require('./models/coupon');
const sequelize = require('/Users/diptisharma/Desktop/PlayMania/config/database.js');

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
const jwtTokens = require('/Users/diptisharma/Desktop/PlayMania/utils/jwt-helpers.js');
const cookieParser = require('cookie-parser');
const corsOptions = { credentials: true, origin: '*' };

// FOR FORGOT PASSWORD AND RESET LINK
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
//
const sendGridKey = process.env.SENDGRID_KEY;
const resetSecret = process.env.RESET_SECRET;

// importing the functions for forgot password and reset link
const sendMail = require('/Users/diptisharma/Desktop/PlayMania/utils/sendMail.js');
const {
  filterBy,
  update,
} = require('/Users/diptisharma/Desktop/PlayMania/utils/filterBy.js');
// const update = require('/Users/diptisharma/Desktop/PlayMania/utils/filterBy.js')

// FOR AUTHENTICATION
const authenticateToken = require('/Users/diptisharma/Desktop/PlayMania/middleware/authorization.js');
// for signup
const isUserAuth = require('/Users/diptisharma/Desktop/PlayMania/middleware/isUserAuth.js');
// for role specific
const userRole = require('/Users/diptisharma/Desktop/PlayMania/middleware/userRoles.js');

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
const getAllUsers = require('/Users/diptisharma/Desktop/PlayMania/routes/getAllUsers.js');
const userLogin = require('/Users/diptisharma/Desktop/PlayMania/routes/userLogin.js');
const userLogout = require('/Users/diptisharma/Desktop/PlayMania/routes/userLogout.js');
const newUserRegistration = require('/Users/diptisharma/Desktop/PlayMania/routes/newUserRegistration.js');
const forgotPassword = require('/Users/diptisharma/Desktop/PlayMania/routes/forgotPassword.js');
const refreshToken = require('./routes/refreshToken');
const updatePassword = require('/Users/diptisharma/Desktop/PlayMania/routes/updatePassword.js');

// ************** Game code refactoring **************
const addCategory = require('./routes/addCategory');
const getAllCategory = require('./routes/getAllCategory');
const deleteCategory = require('./routes/deleteCategory');
const addGame = require('./routes/addGame');
const getAllGames = require('./routes/getAllGames');
const deleteGame = require('./routes/deleteGame');
const addCoupon = require('./routes/addCoupon');
const deleteCoupon = require('./routes/deleteCoupon');
const addToCart = require('./routes/addToCart');
const deleteFromCart = require('./routes/deleteFromCart');
const checkout = require('./routes/checkout');

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
