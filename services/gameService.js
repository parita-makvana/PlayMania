const Category = require('../models/category');
const Game = require('../models/game');
const Coupon = require('../models/coupon');
const { Op } = require('sequelize');

const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid');

//  --------------- ADD GAME CATEGORY -----------------------------
async function addCategory(req) {
  try {
    const { user_age_limit, category_name, category_description } = req.body;
    const category_id = uuidv4();

    await sequelize.sync(); // Wait for the synchronization to complete

    const result = await Category.create({
      category_id: category_id,
      user_age_limit: user_age_limit,
      category_name: category_name,
      category_description: category_description,
    });
    return result; // Return the created category
  } catch (error) {
    console.error(
      'Error while registering game category, try again....',
      error
    );
    throw error; // Rethrow the error to be handled in the controller
  }
}

// --------------- DELETE CATEGORY -----------------------------
async function deleteCategory(req) {
  try {
    let categoryID = req.params.categoryID;
    console.log('Received categoryID:', categoryID);

    await sequelize.sync(); // Wait for the synchronization to complete

    const result = await Category.destroy({
      where: {
        category_id: categoryID,
      },
    });
    console.log('Deletion result:', result);
    return result; // Return the number of deleted rows
  } catch (error) {
    console.error('Error while deleting game category:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
}

// --------------- GET ALL CATEGORY -----------------------------
async function getAllCategory() {
  try {
    await sequelize.sync(); // Wait for the synchronization to complete

    const result = await Category.findAll({
      order: [['createdAt', 'DESC']],
    });
    return result; // Return the number of deleted rows
  } catch (error) {
    console.error('Error while retrieving game category:', error);
    throw error; // Rethrow the error to be handled in the controller
  }
}

// --------------- ADD GAME COUPON -----------------------------
async function addCoupon(req) {
  try {
    const game_id = req.params.gameID;
    const { coupon_title, coupon_discription, coupon_discount } = req.body;
    const coupon_id = uuidv4();
    await sequelize.sync(); // Wait for the synchronization to complete

    const result = Coupon.create({
      coupon_id: coupon_id,
      game_id: game_id,
      coupon_title: coupon_title,
      coupon_discription: coupon_discription,
      coupon_discount: coupon_discount,
    });
    return result; // Return the number of deleted rows
  } catch (error) {
    console.error('Error while adding game coupon', error);
    throw error; // Rethrow the error to be handled in the controller
  }
}

// --------------- ADD GAME (needs user model) -----------------------------

// --------------- DELETE GAME COUPON -----------------------------
async function deleteCoupon(req) {
  try {
    let couponID = req.params.gameID;

    await sequelize.sync(); // Wait for the synchronization to complete

    const result = await Coupon.destroy({
      where: {
        coupon_id: couponID,
      },
    });

    return result; // Return the number of deleted rows
  } catch (error) {
    console.error('Error while deleting game coupon', error);
    throw error; // Rethrow the error to be handled in the controller
  }
}

// --------------- GET ALL GAMES CURSOR ENCODING | PAGENATION -----------------------------
async function getAllGames(req, res) {
  const { limit, cursor } = req.params;

  try {
    let hasPrevPage = false;
    let nextCursor = null;

    let whereCondition = {};

    if (cursor !== 'null') {
      // Decode the base64 cursor value
      const decodedCursor = Buffer.from(cursor, 'base64').toString('utf-8');

      whereCondition = {
        createdAt: { [Op.lt]: decodedCursor },
      };
      hasPrevPage = true;
    }

    const games = await Game.findAll({
      where: whereCondition,
      limit: parseInt(limit) + 1,
      order: [['createdAt', 'DESC']],
    });

    let hasNextPage = false;
    if (games.length > parseInt(limit)) {
      // Remove the extra game that was fetched for checking hasNextPage
      games.pop();

      if (games.length === parseInt(limit)) {
        // Get the next cursor value
        // converting the createdAt timestamp value to base64 encoding for nextCursor value
        nextCursor = Buffer.from(
          games[games.length - 1].createdAt.toString()
        ).toString('base64');
        hasNextPage = true;
      }
    }

    return { games, hasNextPage, hasPrevPage, nextCursor };
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve games.' });
  }
}

// Exporting the service function
module.exports = {
  addCategory,
  deleteCategory,
  getAllCategory,
  addCoupon,
  deleteCoupon,
  getAllGames,
};
