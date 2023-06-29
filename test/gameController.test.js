// const request = require('supertest');
// const app = require('../index');

// let server;

// beforeEach((done) => {
//   server = app.listen(3000, () => {
//     done();
//   });
// });

// afterEach((done) => {
//   server.close(() => {
//     done();
//   });
// });

// it('should create a new category', async () => {
//   const response = await request(app).post('/game/game_category').send({
//     user_age_limit: 18,
//     category_name: 'Action',
//     category_description: 'Action games',
//   });

//   expect(response.status).toBe(200);
//   expect(response.body.message).toBe('Category created successfully!');
//   expect(response.body.result).toBeDefined();
// });

// // Add more test cases here for other routes and functionality
