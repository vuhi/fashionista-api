const { APIError } = require('../models/api-error.class');

const authRole = (...roles) => {
  // eslint-disable-next-line consistent-return
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new APIError('You are not allow to access this content', 403));
    }
    next();
  };
};

module.exports = { authRole };
