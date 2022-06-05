const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const { deleteAllJobs } = require('../lib/models/Job');

const agent = request.agent(app);

// Mock Job Objects
const mockJob = {
  title: 'software dev',
  company: 'Google',
  fav: false,
  remote: 'true',
  zipcode: 97202,
  wishlist: true,
  applied: false,
  phone_screen: true,
  interviewed: false,
  take_home: false,
  technical_interview: false,
  offer: false,
  rejected: true,
  accepted: false,
  url: 'http://www.glassdoor.com/',
  description: 'A cool job',
  notes: 'Alanis Morissette is canadian',
  contact_name: 'Alanis',
  contact_email: 'alanis@dot.com',
  salary: '$5',
};

const mockJob2 = {
  title: 'Staff Engineer',
  company: 'ABC.com',
  fav: true,
  remote: 'hybrid',
  zipcode: 12345,
  wishlist: false,
  applied: true,
  phone_screen: true,
  interviewed: true,
  take_home: true,
  technical_interview: true,
  offer: true,
  rejected: false,
  accepted: true,
  url: 'https://taylorcallanwilliams.io',
  description: 'A cool job',
  notes: 'Taylor is Cool',
  contact_name: 'Taylor',
  contact_email: 'hello@tayloriscool.com',
  salary: '$5',
};

// Dummy user object
const mockUser = {
  username: 'taylor_is_cool',
  password: '12345',
};

// Create User & Log In (Delete all test jobs first)
const mockUserLogin = async () => {
  await deleteAllJobs();
  const user = await UserService.create({ ...mockUser });
  await agent
    .post('/api/v1/users/login')
    .send({ username: user.username, password: mockUser.password });
  return user;
};

// Post 2 mock jobs
const post2Jobs = async (userId) => {
  const res1 = await agent
    .post('/api/v1/jobs')
    .send({ user_id: userId, ...mockJob });
  const res2 = await agent
    .post('/api/v1/jobs')
    .send({ user_id: userId, ...mockJob2 });
  return [res1.body, res2.body];
};

describe('Job route tests', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  // Test: Auth + Add new Job
  it('allows a logged in user to add a new job', async () => {
    const user = await mockUserLogin();
    // Post 1 new Job
    const res = await agent
      .post('/api/v1/jobs')
      .send({ ...mockJob, user_id: user.id });

    expect(res.body).toEqual({
      id: expect.any(String),
      created_at: expect.any(String),
      last_updated: expect.any(String),
      user_id: expect.any(String),
      ...mockJob,
    });
  });

  // Test: Auth + Get All User's jobs
  it('allows a logged in user to get all of their jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);

    const res = await agent.get('/api/v1/jobs');
    expect(res.body).toEqual([
      {
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
      },
    ]);
  });

  // Test: Auth + Delete Job
  it('allows a logged in user to delete job', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);

    await agent.delete('/api/v1/jobs/1');
    const res = await agent.get('/api/v1/jobs');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob2,
      },
    ]);
  });

  // Test: Auth + Get Job By ID
  it('allows a logged in user to get a job by ID', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);

    const res = await agent.get('/api/v1/jobs/1');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob,
      },
    ]);
  });

  // Test: Auth + Update Job
  it.skip('allows a logged in user to update a job', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);

    const res = await agent
      .patch('/api/v1/jobs/1')
      .send({ ...mockJob, fav: true });
    expect(res.body).toEqual(
      expect.objectContaining({
        ...mockJob,
        fav: true,
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
      })
    );
  });

  // Test: Auth + Get all Favorite Jobs
  it('allows a logged in user to get all fav = true jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    const res = await agent.get('/api/v1/jobs/fav');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob2,
      },
    ]);
  });

  // Test: Auth + Get all Applied Jobs
  it('allows a logged in user to get all applied = true jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    const res = await agent.get('/api/v1/jobs/applied');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob2,
      },
    ]);
  });

  // Test: Auth + Get all Phone Screened Jobs
  it('allows a logged in user to get all phone_screen = true jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    const res = await agent.get('/api/v1/jobs/phone-screened');
    expect(res.body).toEqual([
      {
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
      },
    ]);
  });

  // Test: Auth + Get all Interviewed Jobs
  it('allows a logged in user to get all interviewed = true jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    const res = await agent.get('/api/v1/jobs/interviewed');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob2,
      },
    ]);
  });

  // Test: Auth + Get all Take Home Challenged Jobs
  it('allows a logged in user to get all take_home = true jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    const res = await agent.get('/api/v1/jobs/take-home');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob2,
      },
    ]);
  });

  // Test: Auth + Get all Technically Interviewed Jobs
  it('allows a logged in user to get all technical_interview = true jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    const res = await agent.get('/api/v1/jobs/tech-interview');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob2,
      },
    ]);
  });

  // Test: Auth + Get all Offer Jobs
  it('allows a logged in user to get all offer = true jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    const res = await agent.get('/api/v1/jobs/offer');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob2,
      },
    ]);
  });

  // Test: Auth + Get all Rejected Jobs
  it('allows a logged in user to get all rejected = true jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    const res = await agent.get('/api/v1/jobs/rejected');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob,
      },
    ]);
  });

  // Test: Auth + Get all Accepted Jobs
  it('allows a logged in user to get all accepted = true jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    const res = await agent.get('/api/v1/jobs/accepted');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob2,
      },
    ]);
  });

  // Test: Auth + Get all Wishlisted Jobs
  it('allows a logged in user to get all wishlist = true jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    const res = await agent.get('/api/v1/jobs/wishlist');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob,
      },
    ]);
  });

  // Test: Auth + Get all Remote Jobs
  it('allows a logged in user to get all remote = true jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    const res = await agent.get('/api/v1/jobs/remote');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob,
      },
    ]);
  });

  // Test: Auth + Get all Non-Remote Jobs
  it.skip('allows a logged in user to get all remote = false jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    await agent.patch('/api/v1/jobs/1').send({ ...mockJob, remote: 'false' });
    const res = await agent.get('/api/v1/jobs/non-remote');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob,
        remote: 'false',
      },
    ]);
  });

  // Test: Auth + Get all Remote Jobs
  it('allows a logged in user to get all remote = hybrid jobs', async () => {
    const user = await mockUserLogin();
    await post2Jobs(user.id);
    const res = await agent.get('/api/v1/jobs/hybrid');
    expect(res.body).toEqual([
      {
        id: expect.any(String),
        created_at: expect.any(String),
        last_updated: expect.any(String),
        user_id: expect.any(String),
        ...mockJob2,
      },
    ]);
  });
});
