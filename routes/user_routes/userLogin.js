// Importing modules
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// from ORM
const User = require('../../models/user.js');
const sequelize = require('../../config/database.js');

// to get the jwtwebtoken
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwtTokens = require('../../utils/jwt-helpers.js');
const cookieParser = require('cookie-parser');
const corsOptions = { credentials: true, origin: '*' };

// FOR AUTHENTICATION
const authenticateToken = require('../../middleware/authorization.js');
// for signup
const isUserAuth = require('../../middleware/isUserAuth.js');
// for role specific
const userRole = require('../../middleware/userRoles.js');

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

// API -- User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // with orm
    const result = await User.findOne({ where: { email: email } });
    if (!result) {
      return res
        .status(401)
        .json({ message: 'Either email or password is wrong... try again.' });
    }
    const validPassword = await bcrypt.compare(
      password,
      result.hashed_password
    );
    if (!validPassword) {
      return res
        .status(401)
        .json({ message: 'Either email or password is wrong... try again.' });
    } else {
      let tokens = jwtTokens(result);
      res.cookie('access_token', tokens.accessToken, { httpOnly: true });
      res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });

      // add this line afterwards to get the tokens as response
      // -- gives error when we try to send multiple responses
      // res.json(tokens);                                          // use this to get the access and refresh token
      res.status(200).json({ message: 'Login successful' });
    }
  } catch (error) {
    console.error('Error during login: Please try again', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = userLogin;
