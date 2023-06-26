const Category = require('../../models/category');

const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
};

module.exports = getAllCategory;
