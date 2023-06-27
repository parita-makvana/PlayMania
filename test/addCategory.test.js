const assert = require('assert');
const { v4: uuidv4 } = require('uuid');
const Category = require('../models/category');
const addCategory = require('../routes/game_routes/addCategory');

describe('addCategory', () => {
  it('should create a new category and return success message', async () => {
    // Mocking the request and response objects
    const req = {
      body: {
        user_age_limit: 18,
        category_name: 'Action',
        category_description: 'Category for action games',
      },
    };

    let sendCalled = false;
    let jsonCalled = false;

    const res = {
      send: (responseData) => {
        assert.deepStrictEqual(responseData, {
          success: false,
          message: 'important fields empty',
          errors: [
            {
              field: 'category_description',
              message: 'This field cannot be empty',
            },
          ],
        });
        sendCalled = true;
      },
      json: (responseData) => {
        assert.deepStrictEqual(responseData, {
          message: 'Category created successfully!',
        });
        jsonCalled = true;
      },
      status: (statusCode) => {
        assert.strictEqual(statusCode, 200);
        return res;
      },
    };

    // Mocking the UUID
    const originalUUIDFn = uuidv4;
    uuidv4 = () => 'mocked_uuid';

    // Mocking the Category model create method
    let createCalled = false;
    Category.create = (data) => {
      assert.deepStrictEqual(data, {
        category_id: 'mocked_uuid',
        user_age_limit: 18,
        category_name: 'Action',
        category_description: 'Category for action games',
      });
      createCalled = true;
    };

    await addCategory(req, res);

    assert.strictEqual(sendCalled, false);
    assert.strictEqual(jsonCalled, true);
    assert.strictEqual(createCalled, true);

    // Restore the original UUID function
    uuidv4 = originalUUIDFn;
  });

  it('should return an error response when required fields are missing', async () => {
    // Mocking the request and response objects
    const req = {
      body: {
        user_age_limit: 18,
        category_name: '', // Missing category_name
        category_description: 'Category for action games',
      },
    };

    let sendCalled = false;

    const res = {
      send: (responseData) => {
        assert.deepStrictEqual(responseData, {
          success: false,
          message: 'important field empty',
          errors: [
            {
              field: 'category_name',
              message: 'This field cannot be empty',
            },
          ],
        });
        sendCalled = true;
      },
    };

    await addCategory(req, res);

    assert.strictEqual(sendCalled, true);
  });

  it('should handle internal server errors', async () => {
    // Mocking the request and response objects
    const req = {
      body: {
        user_age_limit: 18,
        category_name: 'Action',
        category_description: 'Category for action games',
      },
    };

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
          message: 'Internal Server Error..',
        });
        jsonCalled = true;
      },
    };

    // Mocking the Category model create method to throw an error
    Category.create = () => {
      throw new Error('Database error');
    };

    await addCategory(req, res);

    assert.strictEqual(statusCalled, true);
    assert.strictEqual(jsonCalled, true);
  });
});
