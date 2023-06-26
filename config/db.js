// Here in this we can establish the DB connection
const { Client } = require("pg");
const dotenv = require("dotenv")
dotenv.config();

const client = new Client({
host: process.env.HOST,
user: process.env.USER,
port: 5432,
password: process.env.PASSWORD,
database: process.env.DATABASE
});

module.exports = client;
