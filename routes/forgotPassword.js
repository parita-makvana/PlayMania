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

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      // look for email in database
      const [user] = await filterBy({ email });
      // if there is no user send back an error
      if(!user) {
        res.status(404).json({ error: "Invalid email" });
      } else {
        // otherwise we need to create a temporary token that expires in 10 mins
        const resetLink = jwt.sign({ user: user.email }, 
        resetSecret, { expiresIn: process.env.EXPIRATION_TIME_RESET_TOKEN });
        // update resetLink property to be the temporary token and then send email
        await update(user.user_id, { resetLink });
        // we'll define this function below
        sendMail(user.email, resetLink);
        res.status(200).json({ message: "Check your email"} );
      }
    } catch(error) {
      res.status(500).json({ message: error.message });
    }
};

module.exports = forgotPassword;