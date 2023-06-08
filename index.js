// Importing modules 
const express = require('express')
const bcrypt = require('bcrypt')
const client = require('/Users/diptisharma/Desktop/PlayMania/config/db.js');


const app = express();
app.use(express.json()); 

const bodyParser = require('body-parser');

app.use(bodyParser.json());

client.connect();


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



//API FOR ADMIN
//To view all users
app.get('/users', (req, res) => {
  client.query(`Select * from public.user `, (err, result) => {
  console.log(result);
  
  if (!err) {
  res.send(result.rows);
  } else {
  res.send(err);
  }
  });
  client.end;
  });
  


// Sign-In 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await client.query(`SELECT * FROM public.user WHERE email = '${email}' `);
    // will get the first element from the email array 
    
    if (!result || !result.rows || result.rows.length === 0) {
      return res.status(401).json(
        { message: 'Email not found, Please register to the app with valid email..' }
        );
    }
    // here we will add the field specific error  -- like if the password did not match then it will give that specific error 
    // comparing the password entered with the password stored 
    const users = result.rows[0]

    // console.log("passwords: ", password, users.hashed_password)
    const validPassword = await bcrypt.compare(password, users.hashed_password);
    // database should have the encrypted password -- solve this 

    if (!validPassword) {
      return res.status(401).json(
        { message: 'Invalid Password' }
        );
    }
    res.status(200).json(
      { message: 'Login successful' }
      );

    // redirecting the user to the home page ----***------ frontend 

  } catch (error) {
    console.error('Error during login: Please try again', error);
    res.status(500).json(
      { message: 'Internal server error'}
      );
  }
});


//------ SIGN UP -----------
app.post('/createUser', async (req, res) => {
  const user = req.body;
  // let hashed_password = "";
  const hashed_password = bcrypt.hashSync(user.password, 10);

// changing from here 
  const username1 = req.body.username;
  const email1 = req.body.email;
  const user_dob = req.body.dob;


// adding validations
  if (!username1){
    res.send({
      success: false,
      message: 'important fields empty',
      errors: [
        {
          field: 'username',
          message: 'This field cannot be empty'
        }
      ]
    })
  } else if (!email1){
    res.send({
      success: false,
      message: 'important field empty',
      errors: [
        {
          field: 'email',
          message: 'This field cannot be empty'
        }
      ]
    })
  } else if (!user_dob){
    res.send({
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


  
  // does not return the hashed password
  // change the name of user.hashed_password to password in postman -- so change it in line 112 as well 
  let insertQuery = `insert into public.user(user_id, username, role, dob, email, hashed_password, subscription_ends)
  values(${user.user_id}, '${user.username}', '${user.role}', '${user.dob}','${user.email}', '${hashed_password}','${user.subscription_ends}')`;

  client.query(insertQuery, (err, result) => {
      if (!err) {
      res.send('Insertion was successful');
      } else {
      console.log(err.message);
      }
      });
      client.end;
      });
      
// AutoIncreament will be added on
// validators need to be added -- for empty fields 



// to start the server 
const port = 8000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});