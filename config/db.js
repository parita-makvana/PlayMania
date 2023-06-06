// Here in this we can establish the DB connection
const { Client } = require("pg");


const client = new Client({
host: "localhost",
user: "postgres",
port: 5432,
password: "@9829233939",
database: "game_app",
});


module.exports = client;