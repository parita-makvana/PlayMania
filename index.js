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


// changed from here -- to get the access of environment variables 
dotenv.config();



const app = express();
app.use(express.json()); 
app.use(bodyParser.json());


// changes from here for JWT 
app.use(cors(corsOptions));
app.use(cookieParser());

// db connection
client.connect();




// for genrating uuid
const uuid = require('uuid');
const { v4: uuidv4 } = require('uuid');


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



// for admin to view all the database 
//To view all users

// router.get('/users', authenticateToken, (req, res,next) =>{


// limit bydefault 5 -- offset pass through body 

app.get('/users',isUserAuth, (req, res) => {
  try {
    client.query(`Select * from public.user `, (err, result) => {
      console.log(result);
    
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
 

  
// Sign-In 

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await client.query(`SELECT * FROM public.user WHERE email = '${email}' `);

    // comparing the password entered with the password stored 
    const users = result.rows[0]

    // console.log("passwords: ", password, users.hashed_password)
    const validPassword = users? await bcrypt.compare(password, users.hashed_password):null;
    
    // database should have the encrypted password -- solve this 
    if ((!result || !result.rows || result.rows.length === 0) || (!validPassword) ){
      return res.status(401).json(
        { message: 'Either email or password is wrong.. try again..' }
        );
    }

    // JWT 
    let tokens = jwtTokens(result.rows[0]);
    res.cookie('access_token', tokens.accessToken, {httpOnly:true});
    res.cookie('refresh_token', tokens.refreshToken, {httpOnly:true});

    // add this line afterwards to get the tokens as response 
    // -- gives error when we try to send multiple responses 

    // res.json(tokens);                                          // use this to get the access and refresh token
    res.status(200).json({ message: 'Login successful' });
    

    // redirecting the user to the home page ----***------ frontend 

  } catch (error) {
    console.error('Error during login: Please try again', error);
    res.status(500).json(
      { message: 'Internal server error'}
      );
  }
});


// // for refresh token -- FRONT END -- to get the tokens
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


// to logout the user -- we basically will cleear cookie --- 
// removing from cookie
app.delete('/refresh_token', (req, res) => {
  try {
    
    res.clearCookie('refresh_token');
    res.clearCookie('access_token');   // chnaged here 
    return res.status(200).json({message: 'Logged out successfuly.'})
  } catch (error) {
    res.status(401).json(
      {error: error.message}
      );
  }
})
// deleting  the jwt when user logs out 



// Registering new user 
app.post('/register', async (req, res) => {
  try {
  const user = req.body;
  // WHEN  TRYING TO ACCESS THE SALT ROUNDS FROM ENV-- GETTING ERROR -- CONVERT TO NUMBER -- DONE 
  const hashed_password = bcrypt.hashSync(user.password, Number(process.env.SALT_ROUNDS));
// 
  const {username, email, dob} = req.body;
// adding validations  -- change to valid  status  codes
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
  }
// express validators -- instead of the above validators 
// to prevent creation of the entry -- return 
// for repeated entries -- validators 


// change the name of user.hashed_password to password in postman -- so change it in line 112 as well 
  let insertQuery = `insert into public.user(user_id, username, role, dob, email, hashed_password, subscription_ends)
  values((SELECT MAX(user_id) from public.user)+1, '${user.username}', '${user.role}', '${user.dob}','${user.email}', '${hashed_password}','${user.subscription_ends}')`;

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

    } catch (error) {
      console.error('Error while registering, register again....', error);
      res.status(500).json(
        { message: 'Internal server error'}
        );
    }
      });
      

// to start the server 
app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}...`);
});

