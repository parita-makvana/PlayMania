const assert = require('assert');
const Category = require('../models/category');
const getAllCategory = require('../routes/game_routes/getAllCategory');

describe('getAllCategory', () => {
  it('should retrieve all categories and return a success response', async () => {
    // Mocking the response object
    let statusCalled = false;
    let jsonCalled = false;

    const res = {
      status: (statusCode) => {
        assert.strictEqual(statusCode, 200);
        statusCalled = true;
        return res;
      },
      json: (responseData) => {
        assert.deepStrictEqual(responseData, {
          categories: [
            { id: 1, name: 'Category 1' },
            { id: 2, name: 'Category 2' },
            { id: 3, name: 'Category 3' },
          ],
        });
        jsonCalled = true;
      },
    };

    // Mocking the Category model findAll method
    Category.findAll = () => {
      return Promise.resolve([
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
        { id: 3, name: 'Category 3' },
      ]);
    };

    await getAllCategory(null, res);

    assert.strictEqual(statusCalled, true);
    assert.strictEqual(jsonCalled, true);
  });

  it('should handle errors and return an error response', async () => {
    // Mocking the response object
    let statusCalled = false;
    let jsonCalled = false;

    const res = {
      status: (statusCode) => {
        assert.strictEqual(statusCode, 500);
        statusCalled = true;
        return res;
      },
      json: (responseData) => {
        assert.deepStrictEqual(responseData, {
          error: 'Failed to retrieve categories.',
        });
        jsonCalled = true;
      },
    };

    // Mocking the Category model findAll method to throw an error
    Category.findAll = () => {
      return Promise.reject(new Error('Database error'));
    };

    await getAllCategory(null, res);

    assert.strictEqual(statusCalled, true);
    assert.strictEqual(jsonCalled, true);
  });
});
