// to get the specific user 
// const client = require("../config/db");

// with orm -- we can use knex 

const User = require('../models/user.js');
const sequelize = require('../config/database.js'); 

const filterBy = (filter) => {
return User.findAll({
    where: filter,
});
};

// function to update the user password
const update = (user_id, changes) => {
return User.update(changes, {
    where: { user_id },
});
};

module.exports = {
    filterBy,
    update
}
