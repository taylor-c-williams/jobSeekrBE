const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// Mock Job Object
const mockJob = {
  fav: false,
  remote: 'hybrid',
  zipcode: 97202,
  applied: true,
  phone_screen: true,
  take_home: true,
  offer: false,
  rejected: false,
  accepted: false,
  url: 'http://www.glassdoor.com/',
  description: 'A cool job',
  notes: 'Alanis Morissette is canadian',
  contact: 'Alanis (208) 772-5518'
};

// Dummy user object
const mockUser = {
  username: 'taylor_is_cool',
  password: '12345'
};

// Helper function registers & logs in with our mock user
const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { username } = user;
  await agent.post('/api/v1/users').send({ username, password });
  await agent.post('/api/v1/jobs').send({ ...mockJob, user_id: user.id });
  return [agent, user];
};

describe ('Job route tests', () => {

  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('allows a logged in user to add a new job', async () => {
    const [agent, user] = await registerAndLogin();
    const res = await agent.post('/api/v1/jobs').send({ ...mockJob, user_id: user.id });
    expect(res.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      userId: expect.any(String),
      ...mockJob,
    });
  });

});
