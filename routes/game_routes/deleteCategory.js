const Category = require('../../models/category');
const sequelize = require('../../config/database');

const deleteCategory = async (req, res) => {
  try {
    let categoryID = req.params.categoryID;
    sequelize.sync().then((result) => {
      return Category.destroy({
        where: {
          category_id: categoryID,
        },
      });
    });
    res.status(200).json({
      message: 'Category deleted succesfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
};

module.exports = deleteCategory;
