const { v4: uuidv4 } = require('uuid');
const Category = require('/Users/paritamakvana/Desktop/MyPlayMania/PlayMania-Backened/models/category.js');
const sequelize = require('/Users/paritamakvana/Desktop/MyPlayMania/PlayMania-Backened/config/db.js');

const addCategory = async (req, res) => {
  try {
    const { user_age_limit, category_name, category_description } = req.body;
    const category_id = uuidv4();

    //-----VALIDATIONS-----------
    if (!user_age_limit) {
      return res.send({
        success: false,
        message: 'important fields empty',
        errors: [
          {
            field: 'user_age_limit',
            message: 'This field cannot be empty',
          },
        ],
      });
    } else if (!category_name) {
      return res.send({
        success: false,
        message: 'important field empty',
        errors: [
          {
            field: 'category_name',
            message: 'This field cannot be empty',
          },
        ],
      });
    } else if (!category_description) {
      return res.send({
        success: false,
        message: 'important field empty',
        errors: [
          {
            field: 'category_description',
            message: 'This field cannot be empty',
          },
        ],
      });
    }

    sequelize
      // .sync({ force: true })
      .sync()
      .then((result) => {
        //console.log(result);

        return Category.create({
          category_id: category_id,
          user_age_limit: user_age_limit,
          category_name: category_name,
          category_description: category_description,
        });
      });

    res.status(200).json({ message: 'Category created successfully!' });
  } catch (error) {
    console.error(
      'Error while registering game category, try again....',
      error
    );
    res.status(500).json({ message: 'Internal Server Error..' });
  }
};

module.exports = addCategory;
