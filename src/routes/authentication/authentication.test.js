const request = require('supertest');
const app = require('../../app');

describe('Test POST /authentication/register', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .post('/authentication/register')
            .send({
                "name": "Harry Potter",
                "email": "h.potter@hogwarts.co.uk",
                "password": "NeitherCanLiveWhileTheOtherSurvives"
            })
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body).toBe('Successful registration.');
    });

    test('It should respond with 400: Incorrect form submission', async () => {
        const response = await request(app)
            .post('/authentication/register')
            .send({
                "name": "Harry Potter"
            })
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toBe('Incorrect form submission.');
    });

    test('It should respond with 400: User is already registered', async () => {
        const response = await request(app)
            .post('/authentication/register')
            .send({
                "name": "Ron Weasley",
                "email": "r.weasley@hogwarts.co.uk",
                "password": "MyBrosHateMeAndMyBestieDatesMySister"
            })
            .expect('Content-Type', /json/)
            .expect(200);

        const secondResponse = await request(app)
            .post('/authentication/register')
            .send({
                "name": "Ron Weasley",
                "email": "r.weasley@hogwarts.co.uk",
                "password": "MyBrosHateMeAndMyBestieDatesMySister"
            })
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toBe('Successful registration.');
        expect(secondResponse.body).toBe('User is already registered. Reset your password.');
    });
});

describe('Test POST /authentication/authenticate', () => {
    test('It should respond with 200 success', async () => {
        const response = await request(app)
            .post('/authentication/authenticate')
            .send({
                "email": "h.potter@hogwarts.co.uk",
                "password": "NeitherCanLiveWhileTheOtherSurvives"
            })
            .expect('Content-Type', /json/)
            .expect(200);
    });

    test('It should respond with 400: Incorrect form submission', async () => {
        const response = await request(app)
            .post('/authentication/authenticate')
            .send({
                "email": "h.potter@hogwarts.co.uk"
            })
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toBe('Incorrect form submission.');
    });

    test('It should respond with 400: Username/password combination doesn\'t exist', async () => {
        const response = await request(app)
            .post('/authentication/authenticate')
            .send({
                "email": "someOddEmail@email.com",
                "password": "NeitherCanLiveWhileTheOtherSurvives"
            })
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toBe('Username/password combination doesn\'t exist.');
    });

    test('It should respond with 400: Mismatching credentials', async () => {
        const response = await request(app)
            .post('/authentication/authenticate')
            .send({
                "email": "h.potter@hogwarts.co.uk",
                "password": "MyCatSteppedOnTheKeybo123ja4sf"
            })
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toBe('Mismatching credentials.');
    });
});
