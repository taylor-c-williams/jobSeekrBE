const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const agent = request.agent(app);

// Dummy user object
const mockUser = {
  username: 'taylor_is_cool',
  password: '12345',
};

// Helper function registers & logs in with our mock user
const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { username } = user;
  await agent.post('/api/v1/users/login').send({ username, password });
  return [agent, user];
};

describe ('User route tests', () => {

  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() =>  {
    pool.end();
  });

  it('creates a new user', async () => {
    const res = await request(app).post('/api/v1/users/register').send(mockUser);
    const { username } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      username
    });
  });

  it('logs in a mock user', async () => {
    const [agent] = await registerAndLogin();
    const sessions = await agent.post('/api/v1/users/login').send(mockUser);

    expect(sessions.body).toEqual({
      message: 'Login Successful!'
    });
  });

  it('logs a user out', async () => {
    const [agent] = await registerAndLogin();
    const res = await agent.delete('/api/v1/users/login').send(mockUser);

    expect(res.body).toEqual({
      success: true,
      message: 'Logged out successfully!'
    });
  });
});
