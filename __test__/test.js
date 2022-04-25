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
                nome: 'test',
                sobrenome: `${RANDOM}`,
                mail: `test${RANDOM}@gmail.com`,
                senha: 'pizza123'
            })
        
        expect(res.status).toEqual(201);
    });

    it('Login test', async () => {
        const res = await request(app)
            .post('/login')
            .send({
                mail: `test${RANDOM}@gmail.com`,
                senha: 'pizza123'
            })

        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('token');
        TOKEN = res.body.token
        id = res.body.usuario.id
    })

    it('View user test', async () => {
        const res = await request(app)
            .get(`/user/${id}`)
            .set('Authorization', `Token ${TOKEN}`)

        expect(res.status).toEqual(200);
    })

    it('Edit user test', async () => {
        const res = await request(app)
            .put(`/user/${id}`)
            .set('Authorization', `Token ${TOKEN}`)
            .send({
                nome: `testUpdate`,
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