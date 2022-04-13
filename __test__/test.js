const app = require('../src/server');
const request = require('supertest');

describe('GET /', () => {
    it('should return 200 OK', async () => {
        const res = await request(app)
            .get('/')
        
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Hello World');
    });
});