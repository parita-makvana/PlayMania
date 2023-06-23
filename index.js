// Importing modules 
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const client = require('/Users/diptisharma/Desktop/PlayMania/config/db.js');
const dotenv = require('dotenv');

// from ORM 
const User = require('/Users/diptisharma/Desktop/PlayMania/models/user.js');
const sequelize = require('/Users/diptisharma/Desktop/PlayMania/config/database.js'); 

//CONNECTION
sequelize
  .sync()                         // .sync({force:true})
  .then((result) => {
    // console.log(result);
  })
  .catch((err) => {
    // console.log(err);
  });



// to get the jwtwebtoken 
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwtTokens = require('/Users/diptisharma/Desktop/PlayMania/utils/jwt-helpers.js');
const cookieParser = require('cookie-parser');
const corsOptions = {credentials:true, origin: '*'};



// FOR FORGOT PASSWORD AND RESET LINK 
const sgMail = require('@sendgrid/mail');
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

// db connection
client.connect();

// orm
const { v4: uuidv4 } = require('uuid');

// router 
const router = express.Router();


// -----------------FOR ADMIN: TO GET ALL THE USERS---------------
app.get('/users',isUserAuth, async (req, res) => {
  try {
    // client.query(`Select * from public.user `, (err, result) => {
    //   // console.log(result);

    //   if (!err) {
    //   res.send(result.rows);
    //   } else {
    //   res.status(401).json({message: err.message})
    //   }
    //   });
    //   client.end;

      // --------------- with orm --------------------
        const users = await User.findAll();
        res.send(users);
    // ----------------
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      res.status(401).json({ message: 'Unauthorized' });
    } else {
      res.status(500).json({ message: error.message});
    }
  }
});


// ----------------FOR LOGIN----------------------        status code can be removed***to avoid error 
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // with orm
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
  
      // add this line afterwards to get the tokens as response 
      // -- gives error when we try to send multiple responses 
      // res.json(tokens);                                          // use this to get the access and refresh token
      res.status(200).json({ message: 'Login successful' });
      }
  } catch (error) {
    console.error('Error during login: Please try again', error);
    res.status(500).json(
      { message: 'Internal server error'}
      );
  }
});


// ---- USER SPECIFIC-------



//------------FOR LOGOUT----------------------------
// to logout the user -- we basically will clear cookie --- 
// deleting  the jwt when user logs out 

app.delete('/refresh_token', (req, res) => {
  try {
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');   // changed here 
    return res.status(200).json({message: 'Logged out successfuly.'})
  } catch (error) {
    res.status(401).json(
      {error: error.message}
      );
  }
})

//--------- FOR REGISTERING NEW USER---------------------- 
app.post('/register', async (req, res) => {
  try {
    // console.log(req)
    // console.log(req.body)
    const user = req.body;
    const hashed_password = bcrypt.hashSync(user.password, Number(process.env.SALT_ROUNDS));

    // defactoring
    const {dob} = req.body;

    // making username and email case insensitive 
    username = req.body.username.toLowerCase();
    email = req.body.email.toLowerCase();

    // to prevent repeated entry: 
    // orm 
    const usernameResult = await User.count({ where: { username: username } });
    const emailResult = await User.count({ where: { email: email } });
    const duplicateUsername = usernameResult;
    const duplicateEmail = emailResult;


    //check
    const passwordLenght = (user.password).length
  
    //-----VALIDATION FOR EMPTY ENTRIES-----------  --- add the status code 401 in the response 
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
    } else if (!email){
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
    } else if (!dob){
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
  } else if (passwordLenght < 8){
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
  } else if (duplicateUsername > 0){
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
  } else if (duplicateEmail > 0 ){
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
    } else {
      // code with orm 
      const user_id = uuidv4();

      const user = {
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
    
      }
    } catch (error) {
      console.error('Error while registering, register again....', error);
      res.status(500).json(
        { message: 'Internal Server Error..'}
        );
    }
      });
    

// -----------TO GET THE REFRESH TOKEN---------------
app.get('/refresh_token', (req, res) =>{
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
});



// to start the server 
app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}...`);
});

// pagination
// SELECT * FROM public.user WHERE CreatedAt < @p1 ORDER BY CreatedAt DESC LIMIT  10

// first page 
// SELECT * FROM public.user ORDER BY CreatedAt DESC LIMIT 10 --- most recent user will be first 