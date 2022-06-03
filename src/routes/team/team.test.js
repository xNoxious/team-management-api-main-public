const request = require('supertest');
const app = require('../../app');

describe('Test GET /team', () => {
    let token;

    // run before all tests in suite
    beforeEach(async () => {
        const response = await request(app)
            .post('/authentication/register')
            .send({
                "name": "Harry Potter",
                "email": "h.potter@hogwarts.co.uk",
                "password": "NeitherCanLiveWhileTheOtherSurvives"
            });

        const tokenResponse = await request(app)
            .post('/authentication/authenticate')
            .send({
                "email": "h.potter@hogwarts.co.uk",
                "password": "NeitherCanLiveWhileTheOtherSurvives"
            })
            .expect('Content-Type', /json/)
            .expect(200);

        token = tokenResponse.body;
    });

    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .get('/team')
            .set('x-access-token', token)
            .expect(200);
    });
});
