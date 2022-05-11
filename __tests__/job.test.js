const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const agent = request.agent(app);

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

describe ('Job route tests', () => {

  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('allows a logged in user to add a new job', async () => {
    const user = await UserService.create({ ...mockUser });
    await agent.post('/api/v1/users/login').send({ username: user.username, password: mockUser.password });
    const res = await agent.post('/api/v1/jobs').send({ ...mockJob, user_id: user.id });
    expect(res.body).toEqual({
      id: expect.any(String),
      created_at: expect.any(String),
      last_updated: expect.any(String),
      user_id: expect.any(String),
      ...mockJob,
    });
  });

});
