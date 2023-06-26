// Importing modules 
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// from ORM 
const User = require('/Users/diptisharma/Desktop/PlayMania/models/user.js');
const sequelize = require('/Users/diptisharma/Desktop/PlayMania/config/database.js'); 


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

const refreshToken = (req, res) =>{
    try {
      const refreshToken = req.cookies.refresh_token;
      // console.log(refreshToken);                         // getting the refresh token 
      if(refreshToken === null) {
        return res.status(401).json({error:'Null refresh token'})
      };
  
      // to verify that the refresh token generated through our refresh token 
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) =>{
        if (error) return res.status(403).json({error:error.message});
  
        let tokens = jwtTokens(user);
        res.cookie('refresh_token', tokens.refreshToken, {httpOnly:true});
        // to get the tokens through api
        res.json(tokens);
      })
  
    } catch (error) {
      res.status(401).json(
        {error: error.message}
        );
    }
  };

  module.exports = refreshToken;