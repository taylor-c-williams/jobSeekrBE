const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Dummy user object
const mockUser = {
  username: 'taylor_is_cool',
  password: '12345',
};

// Helper function registers & logs in with our mock user
const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { username } = user;
  await (await agent.post('/api/v1/users/sessions')).send({ username, password });
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
    const res = await await request(app).post('/api/v1/users/register').send(mockUser);
    const { username } = mockUser;

    console.log(res.body);
    expect(res.body).toEqual({
      id: expect.any(String),
      username
    });
  });
});
