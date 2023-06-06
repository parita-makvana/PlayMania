// Importing modules 
const express = require('express')
const client = require('/Users/diptisharma/Desktop/PlayMania/config/db.js');


const app = express();
app.use(express.json()); 

const bodyParser = require("body-parser");
app.use(bodyParser.json());

client.connect();


// Routes FOR SIGN-IN  AND SIGN-UP pages 

// For getting the Home page of the application 
app.get('/', function (req, res) {
  res.render('home.ejs')
})

// For getting the Sign-in page 
app.get('/login', function (req, res) {
  res.render('login.ejs')
})

// For getting the Sign-up page 
app.get('/register', function (req, res) {
  res.render('register.ejs')
})



//API FOR ADMIN
//To view all users
app.get("/users", (req, res) => {
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
  


//API FOR USER REGISTRATION
//------ SIGN UP -----------
app.post("/createUser", (req, res) => {
  const user = req.body;
  let insertQuery = `insert into public.user(user_id, username, role, dob, email, hashed_password, subscription_ends)
  values(${user.user_id}, '${user.username}', '${user.role}', '${user.dob}','${user.email}', '${user.hashed_password}','${user.subscription_ends}')`;

  client.query(insertQuery, (err, result) => {
      if (!err) {
      res.send("Insertion was successful");
      } else {
      console.log(err.message);
      }
      });
      client.end;
      });
      
// AutoIncreament will be added on

// to start the server 
const port = 8000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});