// Importing modules
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes');
const dotenv = require('dotenv');
const gameRoutes = require('./routes/gameRoutes');

//to get the access of environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

//
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const sequelize = require('./config/database');

// //CONNECTION
// sequelize
//   .sync()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// User
app.use('/', userRouter);

// Game
app.use('/game', gameRoutes);

// to start the server
app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});
