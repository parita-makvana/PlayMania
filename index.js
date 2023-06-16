// Importing modules 
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const client = require('/Users/diptisharma/Desktop/PlayMania/config/db.js');
const dotenv = require('dotenv');

// to get the jwtwebtoken 
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwtTokens = require('/Users/diptisharma/Desktop/PlayMania/utils/jwt-helpers.js');
const cookieParser = require('cookie-parser');
const corsOptions = {credentials:true, origin: '*'};


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



// router 
const router = express.Router();



// Routes FOR SIGN-IN  AND SIGN-UP pages 
// For getting the Home page of the application 
app.get('/', (req, res) => {
  res.render('home.ejs')
})
// For getting the Sign-in page 
app.get('/login', (req, res) => {
  res.render('login.ejs')
})
// For getting the Sign-up page 
app.get('/register', (req, res) => {
  res.render('register.ejs')
})



// -----------------FOR ADMIN: TO GET ALL THE USERS---------------
app.get('/users',isUserAuth, (req, res) => {
  try {
    client.query(`Select * from public.user `, (err, result) => {
      // console.log(result);
      if (!err) {
      res.send(result.rows);
      } else {
      res.status(401).json({message: err.message})
      }
      });
      client.end;
    
  } catch (error) {
    res.status(401).json({message: error.message})
  }
});



// ----------------FOR LOGIN----------------------
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await client.query(`SELECT * FROM public.user WHERE email = '${email}' `);

    // comparing the password entered with the password stored 
    const users = result.rows[0]
    const validPassword = users? await bcrypt.compare(password, users.hashed_password):null;
    
    // database should have the encrypted password
    if ((!result || !result.rows || result.rows.length === 0) || (!validPassword) ){
      return res.status(401).json(
        { message: 'Either email or password is wrong.. try again..' }
        );
    } else {    let tokens = jwtTokens(result.rows[0]);
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


//------------FOR LOGOUT----------------------------
// to logout the user -- we basically will cleear cookie --- 
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
    const user = req.body;
    const hashed_password = bcrypt.hashSync(user.password, Number(process.env.SALT_ROUNDS));
    
    // defactoring
    const {username, email, dob} = req.body;

    // to prevent repeated entry: 
    const isUsernameAlreadyRegistered = `SELECT COUNT(*) FROM public.user WHERE username = '${username}'`;
    const isEmailAlreadyRegistered = `SELECT COUNT(*) FROM public.user WHERE email = '${email}'`;
    const usernameResult = await client.query(isUsernameAlreadyRegistered);
    const emailResult = await client.query(isEmailAlreadyRegistered);
    const duplicateUsername = usernameResult.rows[0].count;
    const duplicateEmail = emailResult.rows[0].count;

    //check
    const passwardLenght = (user.password).length
  
    //-----VALIDATION FOR EMPTY ENTRIES-----------
    if (!username){
      return res.send({
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
      return res.send({
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
      return res.send({
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
  } else if (passwardLenght < 8){
    return res.send({
      success: false,
      message: 'Password is too short, min password lenght is 8',
      errors: [
        {
          field: 'password',
          message: 'Password too weak'
        }
      ]
    })

    //--- VALIDATIONS FOR REPEATED ENTRIES--------
  } else if (duplicateUsername > 0){
    return res.send({
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
    return res.send({
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
    // const userId = uuidv4();
      let insertQuery = `insert into public.user(username, role, dob, email, hashed_password)
      values('${user.username}', '${user.role}', '${user.dob}','${user.email}', '${hashed_password}')`;
      
      client.query(insertQuery, (err, result) => {
          if (!err) {
          // JWT 
          let tokens = jwtTokens(user);
          res.cookie('access_token', tokens.accessToken, {httpOnly:true});
          res.cookie('refresh_token', tokens.refreshToken, {httpOnly:true});
          res.send('Insertion was successful');
          } else {
          console.log(err.message);
          }
          });
          client.end;
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