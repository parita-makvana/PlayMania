const Game = require('../../models/game');
const sequelize = require('../../config/database');

const deleteGame = async (req, res) => {
  try {
    let gameID = req.params.gameID;
    sequelize.sync().then((result) => {
      return Game.destroy({
        where: {
          game_id: gameID,
        },
      });
    });
    res.status(200).json({
      message: 'Game deleted succesfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete game.' });
  }
};

module.exports = deleteGame;
