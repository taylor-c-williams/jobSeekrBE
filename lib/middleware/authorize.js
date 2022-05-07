// const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const email = req.user.email;
    if (email === 'admin'){
      next();
    } else {
      throw new Error('User is not admin');
    }
  } catch (error) {
    error.message = 'You do not have access to this page';
    error.status = 403;
    next(error);
  }
};
