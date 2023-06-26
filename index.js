// Importing modules 
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// from ORM 
const User = require('/Users/diptisharma/Desktop/PlayMania/models/user.js');
const sequelize = require('/Users/diptisharma/Desktop/PlayMania/config/database.js'); 

//CONNECTION
sequelize
  .sync()                         // .sync({force:true})
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
const corsOptions = {credentials:true, origin: '*'};



// FOR FORGOT PASSWORD AND RESET LINK 
const sgMail = require('@sendgrid/mail');
const nodemailer = require("nodemailer");
// 
const sendGridKey = process.env.SENDGRID_KEY;
const resetSecret = process.env.RESET_SECRET;

// importing the functions for forgot password and reset link
const sendMail = require('/Users/diptisharma/Desktop/PlayMania/utils/sendMail.js')
const {filterBy, update} = require('/Users/diptisharma/Desktop/PlayMania/utils/filterBy.js')
// const update = require('/Users/diptisharma/Desktop/PlayMania/utils/filterBy.js')


// FOR AUTHENTICATION
const authenticateToken = require('/Users/diptisharma/Desktop/PlayMania/middleware/authorization.js');
// for signup
const isUserAuth = require('/Users/diptisharma/Desktop/PlayMania/middleware/isUserAuth.js');
// for role specific 
const userRole = require('/Users/diptisharma/Desktop/PlayMania/middleware/userRoles.js')


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

// -----------------FOR ADMIN: TO GET ALL THE USERS---------------
app.route('/users').get(isUserAuth, getAllUsers)             

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

// to start the server 
app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}...`);
});
