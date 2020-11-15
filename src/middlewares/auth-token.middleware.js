const userService = require('../services/user.service');
const { verify } = require('../utils/token.helper');
const { APIError } = require('../models/api-error.class');

const authToken = async (req, res, next) => {
  try {
    const header = req.header('Authorization');
    if (!header) { throw new Error('missing header'); }

    const content = header.split(' ');
    if (content.length !== 2 || !content[0].toLowerCase().startsWith('bearer')) {
      throw new Error('malformed token');
    }

    const userId = await verify(content[1]);
    req.user = await userService.getUser(userId);

    next();
  } catch (err) {
    next(new APIError(err.message, 401, err));
  }
};

module.exports = { authToken };
