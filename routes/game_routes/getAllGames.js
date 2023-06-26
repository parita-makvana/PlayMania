const Game = require('../../models/game');
const sequelize = require('../../config/database');
const { Op, QueryTypes } = require('sequelize');

const getAllGames = async (req, res) => {
  const { limit, currentPage } = req.body;

  try {
    let cursor;
    let hasPrevPage = false;
    if (currentPage) {
      const cursorIndex = (parseInt(currentPage) - 1) * parseInt(limit);

      const gamesBeforeCursor = await Game.findAll({
        limit: cursorIndex,
        order: [['createdAt', 'DESC']],
      });
      cursor =
        gamesBeforeCursor.length > 0
          ? gamesBeforeCursor[gamesBeforeCursor.length - 1].createdAt
          : null;

      if (cursorIndex > 0) {
        hasPrevPage = true;
      }
    }

    const games = await Game.findAll({
      where: cursor ? { createdAt: { [Op.lt]: cursor } } : {},
      limit: parseInt(limit),
      order: [['createdAt', 'DESC']],
    });

    const hasNextPage = games.length === parseInt(limit);

    res.status(200).json({
      games,
      hasNextPage,
      hasPrevPage,
      nextCursor: hasNextPage ? games[games.length - 1].createdAt : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve games.' });
  }
};

module.exports = getAllGames;
