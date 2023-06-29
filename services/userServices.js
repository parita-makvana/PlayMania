// imports 
const express = require('express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

//to get the access of environment variables 
dotenv.config();

const app = express();
app.use(express.json()); 
app.use(bodyParser.json());

// orm
const { v4: uuidv4 } = require('uuid');

const User = require('../models/user');
const sequelize = require('../config/database'); 


// to get the jwtwebtoken 
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwtTokens = require('../utils/jwt-helpers');
const cookieParser = require('cookie-parser');
const corsOptions = {credentials:true, origin: '*'};

// changes from here for JWT ---- remove this 
app.use(cors(corsOptions));
app.use(cookieParser());

// FOR FORGOT PASSWORD AND RESET LINK 
const resetSecret = process.env.RESET_SECRET;


// importing the functions for forgot password and reset link
const sendMail = require('../utils/sendMail')
const {filterBy, update} = require('../utils/filterBy.js')




// functions 

