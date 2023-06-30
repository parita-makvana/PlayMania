const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json());
app.use(bodyParser.json());

const User = require('../models/User');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwtTokens = require('../utils/jwtHelpers');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const { filterBy, update } = require('../utils/filterBy.js');

const corsOptions = { credentials: true, origin: '*' };

app.use(cors(corsOptions));
app.use(cookieParser());

// Get all users
exports.getAllUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    throw error;
  }
};

// User login
exports.userLogin = async (email, password) => {
  try {
    const result = await User.findOne({ where: { email: email } });
    if (!result) {
      return { statusCode: 401, message: 'Either email or password is wrong... try again.' };
    }
    const validPassword = await bcrypt.compare(password, result.hashed_password);
    if (!validPassword) {
      return { statusCode: 401, message: 'Either email or password is wrong... try again.' };
    }
    const tokens = jwtTokens(result);
    return { statusCode: 200, message: 'Login successful', tokens };
  } catch (error) {
    throw error;
  }
};

// New User Registration
exports.createUser = async (user) => {
  const { username, role, dob, email, password } = user;
  const user_id = uuidv4();
  const hashed_password = bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
  const createdUser = await User.create({
    user_id: user_id,
    username: username,
    role: role,
    dob: dob,
    email: email,
    hashed_password: hashed_password
  });
  return createdUser;
};

exports.checkDuplicateUsername = async (username) => {
  const usernameResult = await User.count({ where: { username: username } });
  return usernameResult > 0;
};

exports.checkDuplicateEmail = async (email) => {
  const emailResult = await User.count({ where: { email: email } });
  return emailResult > 0;
};

// Forgot Password
exports.forgotPassword = async (email, resetSecret) => {
  try {
    const [user] = await filterBy({ email });
    if (!user) {
      return { error: 'Invalid email' };
    } else {
      const resetLink = jwt.sign({ user: user.email },
        resetSecret, { expiresIn: process.env.EXPIRATION_TIME_RESET_TOKEN });
      await update(user.user_id, { resetLink });
      sendMail(user.email, resetLink);
      return { message: 'Check your email' };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update Password
exports.updatePassword = async (resetLink, newPassword, resetSecret) => {
  if (!resetLink) {
    throw new Error('Invalid token');
  }
  return new Promise((resolve, reject) => {
    jwt.verify(resetLink, resetSecret, async (error, decodedToken) => {
      if (error) {
        reject(new Error('Incorrect token or expired'));
        return;
      }
      try {
        const [user] = await filterBy({ resetLink });
        if (!user) {
          reject(new Error('Try resetting again..'));
          return;
        }
        const hashedPassword = bcrypt.hashSync(newPassword, Number(process.env.SALT_ROUNDS));
        const updatedCredentials = {
          password: hashedPassword,
          resetLink: null
        };
        await update(user.user_id, updatedCredentials);
        resolve('Password updated');
      } catch (error) {
        reject(new Error(error.message));
      }
    });
  });
};

// Refresh token
exports.refreshToken = (refreshToken, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, secret, (error, user) => {
      if (error) {
        reject(error);
      } else {
        const tokens = jwtTokens(user);
        resolve(tokens);
      }
    });
  });
};