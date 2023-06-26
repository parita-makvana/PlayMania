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

// FOR FORGOT PASSWORD AND RESET LINK
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
//
const sendGridKey = process.env.SENDGRID_KEY;
const resetSecret = process.env.RESET_SECRET;

// importing the functions for forgot password and reset link
const sendMail = require('../../utils/sendMail.js');
const { filterBy, update } = require('../../utils/filterBy.js');
// const update = require('/Users/diptisharma/Desktop/PlayMania/utils/filterBy.js')

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

const updatePassword = async (req, res) => {
  const resetLink = req.params.token;

  if (!resetLink) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
  jwt.verify(
    resetLink,
    process.env.RESET_SECRET,
    async (error, decodedToken) => {
      if (error) {
        res.status(401).json({ message: 'Incorrect token or expired' });
        return;
      }
      try {
        const newPassword = req.body;
        const [user] = await filterBy({ resetLink });
        if (!user) {
          res.status(401).json({ message: 'Try resetting again..' });
          return;
        }
        // creating a hashed password for the user
        const hashPassword = bcrypt.hashSync(
          newPassword.newPassword,
          Number(process.env.SALT_ROUNDS)
        );

        const updatedCredentials = {
          password: hashPassword,
          resetLink: null,
        };

        await update(user.user_id, updatedCredentials);

        res.status(200).json({ message: 'Password updated' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  );
};

module.exports = updatePassword;
