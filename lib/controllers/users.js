const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const UserService = require('../services/UserService');
const User = require('../models/User');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()
  // Create New User
  .post('/register', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.send(user);
    } catch (error) {
      next(error);
    }
  })

  // Log In Validated User
  .post('/login', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const sessionToken = await UserService.logIn({ username, password });
      res
        .cookie(process.env.COOKIE_NAME, sessionToken, {
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Login Successful!' });
    } catch (error) {
      next(error);
    }
  })

  // Delete Session, Cookie & Log Out
  .delete('/login', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Logged out successfully!' });
  })

  // Get Current User
  .get('/current-user', async (req, res, next) => {
    try {
      const { id } = req.user;
      const currentUser = await User.getUserById(id);
      res.send(currentUser);
    } catch (error) {
      next(error);
    }
  })

  // Get All Users
  .get('/', async (req, res, next) => {
    try {
      const users = await User.getAllUsers();
      res.send(users);
    } catch (error) {
      next(error);
    }
  });
