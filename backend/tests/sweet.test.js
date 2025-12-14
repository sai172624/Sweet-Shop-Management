const request = require('supertest');
const app = require('../app');
const db = require('./db');

let adminToken;
let userToken;

beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('Sweets Endpoints', () => {

    // Setup: Create an Admin and a User before running tests
    beforeEach(async () => {
        // Register Admin
        const adminRes = await request(app).post('/api/auth/register').send({
            username: 'admin', email: 'admin@test.com', password: 'password123', role: 'admin'
        });
        adminToken = adminRes.body.data.token;

        // Register User
        const userRes = await request(app).post('/api/auth/register').send({
            username: 'user', email: 'user@test.com', password: 'password123', role: 'user'
        });
        userToken = userRes.body.data.token;
    });

    describe('POST /api/sweets', () => {
        it('should allow Admin to add a sweet', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Gulab Jamun',
                    price: 100,
                    quantity: 50,
                    category: 'Indian Sweet'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.data.name).toBe('Gulab Jamun');
        });

        it('should deny User from adding a sweet', async () => {
            const res = await request(app)
                .post('/api/sweets')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    name: 'Hacker Sweet', price: 10, quantity: 10, category: 'other'
                });

            expect(res.statusCode).toEqual(403); // Forbidden
        });
    });

    describe('GET /api/public/sweets', () => {
        it('should get all public sweets', async () => {
            // Setup: Admin adds a sweet
            await request(app).post('/api/sweets')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Public Cookie', price: 50, quantity: 10, category: 'cookie' });

            const res = await request(app).get('/api/public/sweets');
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.data.sweets.length).toBe(1);
            expect(res.body.data.sweets[0].name).toBe('Public Cookie');
        });
    });
});