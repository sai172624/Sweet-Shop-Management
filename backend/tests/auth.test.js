const request = require('supertest');
const app = require('../app');
const db = require('./db');

// Lifecycle hooks
beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe('Auth Endpoints', () => {

    describe('POST /api/auth/register', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'password123',
                    role: 'user'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
        });

        it('should prevent duplicate emails', async () => {
            // Register once (Use a longer username!)
            await request(app).post('/api/auth/register').send({
                username: 'userOne', // Changed from 'u1' to 'userOne'
                email: 'dup@test.com',
                password: '1234567'
            });

            // Register again
            const res = await request(app).post('/api/auth/register').send({
                username: 'userTwo', // Changed from 'u2' to 'userTwo'
                email: 'dup@test.com',
                password: '1234567'
            });

            expect(res.statusCode).toEqual(409); // Conflict
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with correct credentials', async () => {
            // Setup: Create user first
            await request(app).post('/api/auth/register').send({
                username: 'loginuser', email: 'login@test.com', password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@test.com',
                    password: 'password123'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body.data.token).toBeDefined();
        });

        it('should reject wrong password', async () => {
            // Setup
            await request(app).post('/api/auth/register').send({
                username: 'wrongpass', email: 'wrong@test.com', password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrong@test.com',
                    password: 'WRONGPASSWORD'
                });

            expect(res.statusCode).toEqual(401);
        });
    });
});