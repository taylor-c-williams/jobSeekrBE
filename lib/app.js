const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//CORS
const corsOptions = {
  origin: [
    'http://localhost:3000/',
    'localhost:3000/',
    'https://seekr.netlify.app',
  ],
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'],
  credentials: true,
  preflightContinue: true,
  exposedHeaders: ['Set-Cookie'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Add Access Control Allow Origin headers
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/jobs', require('./controllers/jobs'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
