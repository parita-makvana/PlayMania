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

// to get the jwtwebtoken 
const jwt = require('jsonwebtoken');
const jwtTokens = require('../utils/jwt-helpers');


// FOR FORGOT PASSWORD AND RESET LINK 
const resetSecret = process.env.RESET_SECRET;

// importing the functions for forgot password and reset link
const sendMail = require('../utils/sendMail')
const {filterBy, update} = require('../utils/filterBy.js')


// Services 
const userService = require('../services/userServices');












// ------------Controllers--------------------------

// ------get all users-------
exports.getAllUsers =  async (req, res) => {
    try {
          const users = await User.findAll();
          res.send(users);
    } catch (error) {
      // put this in services
      if (error.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        res.status(500).json({ message: error.message});
      }

    }
  };

// status code send from services -- we will have to make promise -- resolve -- try & reject -- catch

// this will come in services---
// const error = {
//   statusCode:400,
//   message:"Bad Request."
// }

// catch -- in controller 
// res.status(error.statusCode).json(error.message)

// services 




// -------login-------------- 
exports.userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      // with orm --- from here to 72 -- services folder -- 
      const result = await User.findOne({ where: { email: email } });
      if (!result) {
        return res.status(401).json({ message: 'Either email or password is wrong... try again.' });
      }
      const validPassword = await bcrypt.compare(password, result.hashed_password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Either email or password is wrong... try again.' });
      }
      else { let tokens = jwtTokens(result);
        res.cookie('access_token', tokens.accessToken, {httpOnly:true});
        res.cookie('refresh_token', tokens.refreshToken, {httpOnly:true});
    
        res.status(200).json({ message: 'Login successful' });
        } //  till here 
        
    } catch (error) {
      console.error('Error during login: Please try again', error);
      res.status(500).json(
        { message: 'Internal server error'}
        );
    }
  };


// ---------New User Registeration-------------- 
exports.newUserRegistration = async (req, res) => {
    try {
      let user = req.body;
      const hashed_password = bcrypt.hashSync(user.password, Number(process.env.SALT_ROUNDS));
      const {dob} = req.body;

      username = req.body.username.toLowerCase();
      email = req.body.email.toLowerCase();
  
      const usernameResult = await User.count({ where: { username: username } });
      const emailResult = await User.count({ where: { email: email } });
      const duplicateUsername = usernameResult;
      const duplicateEmail = emailResult;
      const passwordLenght = (user.password).length
    
      //-----VALIDATION FOR EMPTY ENTRIES-----------  
      if (!username){
        return res.status(401).send({
          success: false,
          message: 'important fields empty',
          errors: [
            {
              field: 'username',
              message: 'This field cannot be empty'
            }
          ]
        })
      } 
      if (!email){
        return res.status(401).send({
          success: false,
          message: 'important field empty',
          errors: [
            {
              field: 'email',
              message: 'This field cannot be empty'
            }
          ]
        })
      } 
       if (!dob){
        return res.status(401).send({
          success: false,
          message: 'important field empty',
          errors: [
            {
              field: 'dob',
              message: 'This field cannot be empty'
            }
          ]
        })
    // --- VALIDATIONS FOR PASSWORD LENGTH-----
    } 
    if (passwordLenght < 8){
      return res.status(401).send({
        success: false,
        message: 'Password is too short, min password lenght is 8',
        errors: [
          {
            field: 'password',
            message: 'Password too weak'
          }
        ]
      })
  
    //--- Validation for repeated entries--------
    } 
    if (duplicateUsername > 0){
      return res.status(401).send({
        success: false,
        message: 'Select different username',
        errors: [
          {
            field: 'username',
            message: 'Username already exists'
          }
        ]
      })
    } 
    if (duplicateEmail > 0 ){
      return res.status(401).send({
        success: false,
        message: 'Email address already exists',
        errors: [
          {
            field: 'email',
            message: 'Email already exists..'
          }
        ]
      })
      
      // -----Successful Registration of a user------
      } 
        // code with orm 
        const user_id = uuidv4();
  
        user = {
          username: req.body.username,
          role: req.body.role,
          dob: req.body.dob,
          email: req.body.email,
          password: req.body.password
        };
        
        const createdUser = await User.create({
          user_id: user_id,
          username: user.username,
          role: user.role,
          dob: user.dob,
          email: user.email,
          hashed_password: hashed_password
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
        res.status(500).json(
          { message: 'Internal Server Error..'}
          );
      }
};


// --------forgot password------------ 
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      // look for email in database
      const [user] = await filterBy({ email });
      // if there is no user send back an error
      if(!user) {
        res.status(404).json({ error: "Invalid email" });
      } else {
        const resetLink = jwt.sign({ user: user.email }, 
        resetSecret, { expiresIn: process.env.EXPIRATION_TIME_RESET_TOKEN });
        await update(user.user_id, { resetLink });
        sendMail(user.email, resetLink);
        res.status(200).json({ message: "Check your email"} );
      }
    } catch(error) {
      res.status(500).json({ message: error.message });
    }
};


// ----------update password---------------
exports.updatePassword = async (req, res) => {
    const resetLink = req.params.token;
  
    if (!resetLink) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    jwt.verify(resetLink, process.env.RESET_SECRET, async (error, decodedToken) => {
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
        const hashPassword = bcrypt.hashSync(newPassword.newPassword, Number(process.env.SALT_ROUNDS));
  
        const updatedCredentials = {
          password: hashPassword,
          resetLink: null
        };
        await update(user.user_id, updatedCredentials);
        res.status(200).json({ message: 'Password updated' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  };


// logout 
exports.userLogout = (req, res) => {
    try {
      res.clearCookie('refresh_token');
      res.clearCookie('access_token');                 // changed here 
      return res.status(200).json({message: 'Logged out successfuly.'})
    } catch (error) {
      res.status(401).json(
        {error: error.message}
        );
    }
};


// to get the Refresh token 
exports.refreshToken = (req, res) =>{
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
