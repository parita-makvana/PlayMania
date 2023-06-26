const { v4: uuidv4 } = require('uuid');
const User = require('/Users/paritamakvana/Desktop/MyPlayMania/PlayMania-Backened/models/user.js');
const Game = require('/Users/paritamakvana/Desktop/MyPlayMania/PlayMania-Backened/models/game.js');
const Category = require('/Users/paritamakvana/Desktop/MyPlayMania/PlayMania-Backened/models/category.js');
const sequelize = require('/Users/paritamakvana/Desktop/MyPlayMania/PlayMania-Backened/config/db.js');

const addGame = async (req, res) => {
  const {
    game_name,
    game_description,
    game_size,
    price,
    game_type,
    category_id,
  } = req.body;

  const game_id = uuidv4();
  const user_id = req.params.userID;

  try {
    const user = await User.findOne({
      raw: true,
      where: { user_id: user_id },
    });
    user_role = user.role;
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'User not found' });
  }

  try {
    const category = await Category.findOne({
      raw: true,
      where: { category_id: category_id },
    });

    if (category === null) {
      throw new Error('Category not found');
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: 'Category not found' });
  }

  //-----VALIDATIONS-----------
  if (!game_name || !game_description || !game_size || !game_type || !price) {
    return res.status(400).send({
      success: false,
      message: 'important field empty',
      errors: [
        {
          message: 'This field cannot be empty',
        },
      ],
    });
  } else if (user_role != 'seller') {
    return res.send({
      success: false,
      message: 'Error while registering game, not a seller....',
      errors: [
        {
          field: 'user role',
          message: 'You are not a seller !!',
        },
      ],
    });
  }

  try {
    sequelize.sync().then((result) => {
      //console.log(result);
      return Game.create({
        game_id: game_id,
        game_name: game_name,
        game_description: game_description,
        user_id: user_id,
        category_id: category_id,
        game_size: game_size,
        game_type: game_type,
        price: price,
      });
    });
    res.status(200).json({ message: 'Game created successfully!' });
  } catch (error) {
    console.error('Error while registering game, register again....', error);
    res.status(500).json({ message: 'Internal Server Error..' });
  }
};

module.exports = addGame;
