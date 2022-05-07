const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const UserService = require('../services/UserService');
const User = require('../models/User');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;

module.exports = Router()

  // Create New User
  .post('/register', async (req, res, next) => {
    try {
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  })

  // Log In Validated User
  .post('/login', async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const sessionToken = await UserService.logIn({ username, password });
      res.cookie(process.env.COOKIE_NAME, sessionToken, {
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS
      })
        .json({ message: 'Login Successful!' });
    } catch(error) {
      next(error);
    }
  });
