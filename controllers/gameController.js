const gameService = require('../services/gameService');

async function addCategory(req, res) {
  try {
    const { user_age_limit, category_name, category_description } = req.body;

    // ----- VALIDATIONS -----

    const errors = [];

    if (!user_age_limit) {
      errors.push({
        field: 'user_age_limit',
        message: 'This field cannot be empty',
      });
    }

    if (!category_name) {
      errors.push({
        field: 'category_name',
        message: 'This field cannot be empty',
      });
    }

    if (!category_description) {
      errors.push({
        field: 'category_description',
        message: 'This field cannot be empty',
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors,
      });
    }

    const result = await gameService.addCategory(req); // Passing the `req` object here

    res
      .status(200)
      .json({ result: result, message: 'Category created successfully!' });
  } catch (error) {
    console.error('Error while adding game category', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// -----------------------------------------------------------------------------------------

async function deleteCategory(req, res) {
  try {
    const result = await gameService.deleteCategory(req);
    res
      .status(200)
      .json({ result: result, message: 'Category deleted successfully!' });
  } catch (error) {
    console.error('Error while deleting game category', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// -----------------------------------------------------------------------------------------

async function getAllCategory(req, res) {
  try {
    const result = await gameService.getAllCategory();
    res
      .status(200)
      .json({ result: result, message: 'Category retrieved successfully!' });
  } catch (error) {
    console.error('Error while retrieving game categories', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// -----------------------------------------------------------------------------------------
async function addCoupon(req, res) {
  try {
    const { coupon_title, coupon_discription, coupon_discount } = req.body;

    //-----VALIDATIONS-----------
    if (!coupon_title) {
      return res.send({
        success: false,
        message: 'important fields empty',
        errors: [
          {
            field: 'coupon_title',
            message: 'This field cannot be empty',
          },
        ],
      });
    } else if (!coupon_discription) {
      return res.send({
        success: false,
        message: 'important field empty',
        errors: [
          {
            field: 'coupon_discription',
            message: 'This field cannot be empty',
          },
        ],
      });
    } else if (!coupon_discount) {
      return res.send({
        success: false,
        message: 'important field empty',
        errors: [
          {
            field: 'coupon_discount',
            message: 'This field cannot be empty',
          },
        ],
      });
    }

    const result = await gameService.addCoupon(req); // Passing the `req` object here

    res
      .status(200)
      .json({ result: result, message: 'Coupon created successfully!' });
  } catch (error) {
    console.error('Error while adding game coupon', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// -----------------------------------------------------------------------------------------
async function addGame(req, res) {
  console.log('game_controller');
  try {
    const {
      game_name,
      game_description,
      game_size,
      price,
      game_type,
      category_id,
    } = req.body;

    //-----VALIDATIONS-----------
    if (
      !game_name ||
      !game_description ||
      !game_size ||
      !game_type ||
      !price ||
      !category_id
    ) {
      return res.status(400).send({
        success: false,
        message: 'important field empty',
        errors: [
          {
            message: 'This field cannot be empty',
          },
        ],
      });
    }
    const result = await gameService.addGame(req); // Passing the `req` object here

    res
      .status(200)
      .json({ result: result, message: 'Game added successfully!' });
  } catch (error) {
    console.error('Error while adding game', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// -----------------------------------------------------------------------------------------

async function deleteCoupon(req, res) {
  try {
    const result = await gameService.deleteCoupon(req);
    res
      .status(200)
      .json({ result: result, message: 'Coupon deleted successfully!' });
  } catch (error) {
    console.error('Error while deleting game coupon', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// -----------------------------------------------------------------------------------------

async function getAllGames(req, res) {
  try {
    const { games, hasNextPage, hasPrevPage, nextCursor } =
      await gameService.getAllGames(req);

    res.status(200).json({
      games,
      hasNextPage,
      hasPrevPage,
      nextCursor,
    });
  } catch (error) {
    console.error('Error while showing games', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Exporting the controller function
module.exports = {
  addCategory,
  deleteCategory,
  getAllCategory,
  addCoupon,
  addGame,
  deleteCoupon,
  getAllGames,
};
