// Importing modules
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const gameRoutes = require('./routes/gameRoutes');

//to get the access of environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// ************** GAME **************
app.use('/game', gameRoutes);

// to start the server
app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});
