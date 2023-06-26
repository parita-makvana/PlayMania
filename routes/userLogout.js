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

//------------FOR LOGOUT----------------------------
const userLogout = (req, res) => {
    try {
      res.clearCookie('refresh_token');
      res.clearCookie('access_token');   // changed here 
      return res.status(200).json({message: 'Logged out successfuly.'})
    } catch (error) {
      res.status(401).json(
        {error: error.message}
        );
    }
}


module.exports = userLogout;
