const express = require('express');
const userController = require('../controllers/userController')
const isUserAuth = require('../middleware/isUserAuth');

const router = express.Router();

// FOR ADMIN: TO GET ALL THE USERS--
router
    .route('/users')
    .get(isUserAuth, userController.getAllUsers);

// For user Login
router
    .route('/login')
    .post(userController.userLogin);

// For user Logout
router
    .route('/logout')
    .delete(userController.userLogout);  

// For new User Registeration 
router
    .route('/register')
    .post(userController.newUserRegistration);

// For Forgot Password 
router
    .route('/forgot-password')
    .patch(userController.forgotPassword); 

// For Updating password
router
    .route('/reset-password/:token')
    .patch(userController.updatePassword); 

// For getting refresh token -- testing 
router
    .route('/refresh_token')
    .get(userController.refreshToken);

    
module.exports = router;