const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//CORS
app.use(
  cors({
    origin: true,
    // [
    //   'http://localhost:3000/',
    //   'localhost:3000/',
    //   'https://seekr.netlify.app',
    // ],
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'],
    credentials: true,
    preflightContinue: true,
    exposedHeaders: ['Set-Cookie'],
  })
);

// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/jobs', require('./controllers/jobs'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
