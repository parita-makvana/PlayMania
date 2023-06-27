const Game = require('../../models/game');
const { Op } = require('sequelize');

const getAllGamesUsingCursor = async (req, res) => {
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

    res.status(200).json({
      games,
      hasNextPage,
      hasPrevPage,
      nextCursor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve games.' });
  }
};

module.exports = getAllGamesUsingCursor;
