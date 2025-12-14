const request = require('supertest');
const app = require('../app');
const db = require('./db');

let adminToken;
let userToken;
let sweetId;

beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('Purchase Flow', () => {

    beforeEach(async () => {
        // 1. Create Admin
        const adminRes = await request(app).post('/api/auth/register').send({
            username: 'admin', email: 'admin@test.com', password: 'password123', role: 'admin'
        });
        adminToken = adminRes.body.data.token;

        // 2. Create User
        const userRes = await request(app).post('/api/auth/register').send({
            username: 'buyer', email: 'buyer@test.com', password: 'password123', role: 'user'
        });
        userToken = userRes.body.data.token;

        // 3. Admin creates a Sweet (Stock: 10)
        const sweetRes = await request(app)
            .post('/api/sweets')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Test Laddu', price: 20, quantity: 10, category: 'Indian Sweet' });
        
        sweetId = sweetRes.body.data._id;
    });

    it('should allow user to purchase sweet and reduce stock', async () => {
        // Buy 2 Laddus
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 2 });

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);

        // Verify Stock is now 8 (10 - 2)
        const checkRes = await request(app).get(`/api/sweets/${sweetId}`)
            .set('Authorization', `Bearer ${userToken}`);
        
        expect(checkRes.body.data.quantity).toBe(8);
    });

    it('should fail if purchasing more than available stock', async () => {
        // Try to buy 100 Laddus (Stock is 10)
        const res = await request(app)
            .post(`/api/sweets/${sweetId}/purchase`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ quantity: 100 });

        expect(res.statusCode).toEqual(400); // Bad Request
        expect(res.body.message).toMatch(/Insufficient stock/i);
    });
});