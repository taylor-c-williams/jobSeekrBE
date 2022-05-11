const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const agent = request.agent(app);

// Mock Job Objects
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

const mockJob2 = {
  fav: false,
  remote: 'hybrid',
  zipcode: 12345,
  applied: true,
  phone_screen: true,
  take_home: true,
  offer: false,
  rejected: false,
  accepted: false,
  url: 'https://taylorcallanwilliams.io',
  description: 'A cool job',
  notes: 'Taylor is Cool',
  contact: 'hello@taylorcallanwilliams.io'
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

  // Test: Auth + Add new Job
  it('allows a logged in user to add a new job', async () => {
    
    // Create new user & log in
    const user = await UserService.create({ ...mockUser });
    await agent.post('/api/v1/users/login').send({ username: user.username, password: mockUser.password });
    
    // Post a new Job
    const res = await agent.post('/api/v1/jobs').send({ ...mockJob, user_id: user.id });
    
    expect(res.body).toEqual({
      id: expect.any(String),
      created_at: expect.any(String),
      last_updated: expect.any(String),
      user_id: expect.any(String),
      ...mockJob,
    });
  });

  // Test: Auth + get all user's jobs
  it('allows a logged in user to get all of their jobs', async () => {

    // Create user & log in
    const user = await UserService.create({ ...mockUser });
    await agent.post('/api/v1/users/login').send({ username: user.username, password: mockUser.password });

    // Post 2 jobs
    await agent.post('/api/v1/jobs').send({ ...mockJob, user_id: user.id });
    await agent.post('/api/v1/jobs').send({ ...mockJob2, user_id: user.id });

    const res = await agent.get('/api/v1/jobs');
    expect(res.body).toEqual([{
      id: expect.any(String),
      created_at: expect.any(String),
      last_updated: expect.any(String),
      user_id: expect.any(String),
      ...mockJob,
    },
    {
      id: expect.any(String),
      created_at: expect.any(String),
      last_updated: expect.any(String),
      user_id: expect.any(String),
      ...mockJob2,
    }  
    ]);
  });

  // Test: Auth + Delete Job
  it('allows a logged in user to delete job', async () => {

    // Create user & log in
    const user = await UserService.create({ ...mockUser });
    await agent.post('/api/v1/users/login').send({ username: user.username, password: mockUser.password });

    // Post 2 jobs
    await agent.post('/api/v1/jobs').send({ ...mockJob, user_id: user.id });
    await agent.post('/api/v1/jobs').send({ ...mockJob2, user_id: user.id });

    await agent.delete('/api/v1/jobs/1');
    const res = await agent.get('/api/v1/jobs');
    expect(res.body).toEqual([{
      id: expect.any(String),
      created_at: expect.any(String),
      last_updated: expect.any(String),
      user_id: expect.any(String),
      ...mockJob2,
    }]);
  });

});
