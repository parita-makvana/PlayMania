const express = require('express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const jwtTokens = require('../utils/jwtHelpers');
const userService = require('../services/userServices');

dotenv.config();
const app = express();
app.use(express.json());
app.use(bodyParser.json());

const resetSecret = process.env.RESET_SECRET;

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.send(users);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

// User login
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const serviceResponse = await userService.userLogin(email, password);
    res.cookie('access_token', serviceResponse.tokens.accessToken, { httpOnly: true });
    res.cookie('refresh_token', serviceResponse.tokens.refreshToken, { httpOnly: true });
    res.status(serviceResponse.statusCode).json({ message: serviceResponse.message });
  } catch (error) {
    console.error('Error during login: Please try again', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// New user registration
exports.newUserRegistration = async (req, res) => {
  try {
    let user = req.body;
    const { dob } = req.body;
    username = req.body.username.toLowerCase();
    email = req.body.email.toLowerCase();

    // Validation for empty entries
    if (!username) {
      return res.status(401).send({
        success: false,
        message: 'important fields empty',
        errors: [
          {
            field: 'username',
            message: 'This field cannot be empty'
          }
        ]
      });
    }
    if (!email) {
      return res.status(401).send({
        success: false,
        message: 'important field empty',
        errors: [
          {
            field: 'email',
            message: 'This field cannot be empty'
          }
        ]
      });
    }
    if (!dob) {
      return res.status(401).send({
        success: false,
        message: 'important field empty',
        errors: [
          {
            field: 'dob',
            message: 'This field cannot be empty'
          }
        ]
      });
    }

    // Validation for password length
    const passwordLength = user.password.length;
    if (passwordLength < 8) {
      return res.status(401).send({
        success: false,
        message: 'Password is too short, min password length is 8',
        errors: [
          {
            field: 'password',
            message: 'Password too weak'
          }
        ]
      });
    }

    // Validation for repeated entries
    const duplicateUsername = await userService.checkDuplicateUsername(username);
    const duplicateEmail = await userService.checkDuplicateEmail(email);

    if (duplicateUsername) {
      return res.status(401).send({
        success: false,
        message: 'Select different username',
        errors: [
          {
            field: 'username',
            message: 'Username already exists'
          }
        ]
      });
    }
    if (duplicateEmail) {
      return res.status(401).send({
        success: false,
        message: 'Email address already exists',
        errors: [
          {
            field: 'email',
            message: 'Email already exists'
          }
        ]
      });
    }

    // Successful registration of a user
    const hashed_password = bcrypt.hashSync(user.password, Number(process.env.SALT_ROUNDS));
    const createdUser = await userService.createUser({
      username: user.username,
      role: user.role,
      dob: user.dob,
      email: user.email,
      password: user.password
    });

    if (createdUser) {
      let tokens = jwtTokens(createdUser);
      res.cookie('access_token', tokens.accessToken, { httpOnly: true });
      res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
      res.send('Insertion was successful');
    } else {
      console.log('Error during insertion');
    }
  } catch (error) {
    console.error('Error while registering, register again....', error);
    res.status(500).json({ message: 'Internal Server Error..' });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await userService.forgotPassword(email, resetSecret);
    if (result.error) {
      res.status(404).json({ error: result.error });
    } else {
      res.status(200).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  const resetLink = req.params.token;
  const newPassword = req.body.newPassword;

  try {
    const result = await userService.updatePassword(resetLink, newPassword, resetSecret);
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User logout
exports.userLogout = (req, res) => {
  try {
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken === null) {
      return res.status(401).json({ error: 'Null refresh token' });
    }
    const tokens = await userService.refreshToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });
    res.json(tokens);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
