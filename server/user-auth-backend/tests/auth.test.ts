import request from 'supertest';
import app from '../src/app'; // Adjust the path if necessary
import { prisma } from '../src/config'; // Adjust the path if necessary

describe('Authentication Tests', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new user account', async () => {
    const response = await request(app)
      .post('/api/auth/register') // Adjust the route as necessary
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
  });

  it('should log in an existing user', async () => {
    const response = await request(app)
      .post('/api/auth/login') // Adjust the route as necessary
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not log in with incorrect credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login') // Adjust the route as necessary
      .send({
        username: 'testuser',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });
});