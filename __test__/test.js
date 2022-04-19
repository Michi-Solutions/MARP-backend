const app = require('../src/server');
const request = require('supertest');

const RANDOM = Math.random() * 1000
let TOKEN = ""
let id = 0

describe('Server test', () => {
    it('Server run test', async () => {
        const res = await request(app)
            .get('/')
        
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Hello World');
    });
});

describe('Authenticate Test', () => {
    it('Register test', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                name: 'test',
                email: `test${RANDOM}@gmail.com`,
                password: 'pizza123'
            })
        
        expect(res.status).toEqual(201);
    });

    it('Login test', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                email: `test${RANDOM}@gmail.com`,
                password: 'pizza123'
            })

        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('token');
        TOKEN = res.body.token
        id = res.body.user.id
    })

    it('View user test', async () => {
        const res = await request(app)
            .get(`/user/${id}`)
            .set('Authorization', `Token ${TOKEN}`)

        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('user');
    })

    it('Edit user test', async () => {
        const res = await request(app)
            .put(`/user/${id}`)
            .set('Authorization', `Token ${TOKEN}`)
            .send({
                name: `testUpdate`,
            })
        
        expect(res.status).toEqual(200);

    })

    it('Delete user test', async () => {
        const res = await request(app)
            .delete(`/user/${id}`)
            .set('Authorization', `Token ${TOKEN}`)

        expect(res.status).toEqual(200);
    })
})